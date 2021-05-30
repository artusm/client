import React, { useState } from 'react';
import Header from '../../components/root/Header';
import {
    EuiAvatar,
    EuiIcon,
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiInMemoryTable,
    EuiButton,
    EuiHealth,
    EuiEmptyPrompt,
} from '@elastic/eui';
import useSWR from 'swr';
import Link from '../../components/Link';
import { useHistory } from 'react-router';
import { useServer } from '../../utils/server';
import {useAuthContext} from "../../containers/auth";
import {Permissions} from "../../common/permissions";

const AddNewUserButton = () => {
    const history = useHistory();

    const onClick = () => {
        history.push('/users/new');
    };

    return <EuiButton onClick={onClick}>Добавить нового пользователя</EuiButton>;
};

const UserListPage = () => {
    useServer();
    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: 'Список пользователей',
                    },
                ]}
            />
            <EuiPage paddingSize="none">
                <EuiPageBody panelled>
                    <EuiPageHeader
                        iconType="users"
                        pageTitle="Пользователи"
                        description="Список пользователей"
                        rightSideItems={[<AddNewUserButton />]}
                    />

                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="transparent"
                        borderRadius="none"
                    >
                        <EuiPageContentBody>
                            <UserList />
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    );
};



const fetcher = (url: string) => fetch(url).then((res) => res.json());

const pagination = {
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 15],
};

const UserList = () => {
    const {can, currentUser} = useAuthContext();
    const { data, mutate } = useSWR('/api/users', fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            setTimeout(() => revalidate({ retryCount }), 50);
        },
    });
    const [selection, setSelection] = useState([]);
    const [message, setMessage] = useState(() => (
        <EuiEmptyPrompt
            title={<h3>Загрузка пользователей</h3>}
            titleSize="xs"
            body="Идет загрузка пользователей"
        />
    ));
    const canEdit = can(Permissions.EDIT_USER);

    const items = data ? data : [];
    const isLoading = !data;

    const selectionValue = {
        selectable: (user) => user.username !== currentUser.username && can(Permissions.DELETE_USER),
        selectableMessage: (selectable) =>
            !selectable ? 'Вы не можете выделить этого пользователя' : undefined,
        onSelectionChange: (selection) => setSelection(selection),
        initialSelected: [],
    };

    const deleteUsers = async () => {
        if (window.confirm('Удалить')) {
            const url = `/api/users/${selection.map(({ id }) => id).join()}`;
            await fetch(url, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            mutate();
        }
    };

    const actions = [
        {
            name: 'Редактировать',
            description: 'Редактировать этого пользователя',
            render: (item) => (
                canEdit ? <Link to={`/users/${item.username}`}>
                    <EuiIcon type="gear" />
                </Link> : <span />
            ),
        },
    ];

    const columns = [
        {
            field: 'username',
            name: 'Имя пользователя',
            sortable: true,
            mobileOptions: {
                render: (item) => <span>{item.username}</span>,
                header: false,
                truncateText: false,
                enlarge: true,
                fullWidth: true,
            },
            render: (username) => (
                <span>
				<EuiAvatar size="s" name={username} /> {username}
			</span>
            ),
        },
        {
            field: 'full_name',
            name: 'Имя',
            truncateText: true,
            mobileOptions: {
                show: false,
            },
            sortable: true,
        },
        {
            field: 'email',
            name: 'Почта',
        },
        {
            field: 'enabled',
            name: 'Статус',
            dataType: 'boolean',
            render: (enabled) => {
                const color = enabled ? 'success' : 'danger';
                const label = enabled ? 'Активен' : 'Не активен';
                return <EuiHealth color={color}>{label}</EuiHealth>;
            },
            footer: ({ items, pagination }) => {
                return (
                    <strong>
                        Активных: {items.reduce((acc, cur) => acc + cur.enabled, 0)}
                    </strong>
                );
            },
            sortable: true,
        },
        {
            name: 'Дейсвия',
            field: '__',
            actions,
        },
    ];

    const renderDeleteButton = () => {
        if (selection.length === 0) {
            return;
        }

        return (
            <EuiButton color="danger" iconType="trash" onClick={deleteUsers}>
                Удалить ({selection.length})
            </EuiButton>
        );
    };
    const search = {
        toolsLeft: renderDeleteButton(),
        box: {
            incremental: true,
        },
        filters: [
            {
                type: 'is',
                field: 'enabled',
                name: 'Активные пользователи',
                value: true,
            },
        ],
    };

    // @ts-ignore
    return (
        <>
            <EuiInMemoryTable
                items={items}
                itemId="id"
                message={message}
                loading={isLoading}
                rowHeader="username"
                // @ts-ignore
                columns={columns}
                // @ts-ignore
                search={search}
                sorting={true}
                isSelectable={true}
                // @ts-ignore
                selection={selectionValue}
                pagination={pagination}
            />
        </>
    );
};

export default UserListPage;
