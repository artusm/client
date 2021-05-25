import React from "react";
import Header from "../../components/root/Header";
import {
    EuiAvatar,
    EuiIcon,
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiBasicTable,
    EuiButton,
    EuiHealth,
} from "@elastic/eui";
import useSWR from "swr";
import Link from "../../components/Link";
import { useHistory } from "react-router";

const AddNewUserButton = () => {
    const history = useHistory();

    const onClick = () => {
        history.push("/users/new");
    };

    return <EuiButton onClick={onClick}>Добавить нового пользователя</EuiButton>;
};

const UserListPage = () => {
    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: "Список пользователей",
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

const actions = [
    {
        name: "Редактировать",
        description: "Редактировать этого пользователя",
        render: (item) => (
            <Link to={`/users/${item.username}`}>
                <EuiIcon type="gear" />
            </Link>
        ),
    },
];

const columns = [
    {
        field: "username",
        name: "Имя пользователя",
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
        footer: ({ items, pagination }) => {
            return <strong>Всего: {items.length}</strong>;
        },
    },
    {
        field: "full_name",
        name: "Имя",
        truncateText: true,
        mobileOptions: {
            show: false,
        },
    },
    {
        field: "email",
        name: "Почта",
    },
    {
        field: "enabled",
        name: "Статус",
        dataType: "boolean",
        render: (enabled) => {
            const color = enabled ? "success" : "danger";
            const label = enabled ? "Активен" : "Не активен";
            return <EuiHealth color={color}>{label}</EuiHealth>;
        },
        footer: ({ items, pagination }) => {
            return (
                <strong>
                    Активных: {items.reduce((acc, cur) => acc + cur.enabled, 0)}
                </strong>
            );
        },
    },
    {
        name: "Дейсвия",
        field: "__",
        actions,
    },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UserList = () => {
    const { data } = useSWR("/api/users", fetcher);

    const items = data ? data : [];

    // @ts-ignore
    return (
        <EuiBasicTable
            items={items}
            rowHeader="username"
            // @ts-ignore
            columns={columns}
        />
    );
};

export default UserListPage;
