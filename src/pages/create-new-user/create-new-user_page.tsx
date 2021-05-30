import React, { useState, useMemo } from 'react';
import Header from '../../components/root/Header';
import { mutate } from 'swr';
import {
    EuiPage,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiPageBody,
    EuiFormRow,
    EuiSpacer,
    EuiForm,
    EuiFieldPassword,
    EuiButton,
    EuiHealth,
    EuiSuperSelect,
    EuiFieldText,
    EuiComboBox,
} from '@elastic/eui';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useServer } from '../../utils/server';
import {accessOptions} from '../edit-user/edit-user-page';

const NewUserPage = () => {
    useServer();
    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: 'Список пользователей',
                    },
                    {
                        text: 'Создание нового пользователя',
                    },
                ]}
            />
            <EuiPage paddingSize="none">
                <EuiPageBody panelled>
                    <EuiPageHeader
                        iconType="user"
                        pageTitle="Новый пользователь"
                        description="Создание нового пользователя"
                    />

                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="transparent"
                        borderRadius="none"
                    >
                        <EuiPageContentBody>
                            <NewUserForm />
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    );
};

const options = [
    {
        value: 'true',
        inputDisplay: (
            <EuiHealth color="success" style={{ lineHeight: 'inherit' }}>
                Активен
            </EuiHealth>
        ),
    },
    {
        value: 'false',
        inputDisplay: (
            <EuiHealth color="danger" style={{ lineHeight: 'inherit' }}>
                Диактивен
            </EuiHealth>
        ),
    },
];

const NewUserForm = () => {
    const [enabled, setEnabled] = useState('true');
    const [accesses, setAccesses] = useState([]);
    const { register, formState, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const { errors } = formState;
    const onSubmit = async ({ email, username, password, full_name }) => {
        setIsLoading(true);

        const data = await fetch('/api/users', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                enabled: enabled === 'true',
                email,
                username,
                password,
                full_name,
                permissions: accesses.map((a: any) => a.value),
            }),
        });

        setIsLoading(false);
        const json: any = await data.json();
        if (json.created) {
            mutate('/api/users');
            history.push(`/users/${json.user.username}`);
        } else if (json.errors) {
        }
    };

    const showErrors = !!Object.keys(errors).length;

    const highlightedErrors = useMemo(() => {
        const err = [];

        for (const f in errors) {
            // @ts-ignore
            if (errors[f].message) {
                // @ts-ignore
                err.push(errors[f].message);
            }
        }

        return err;
    }, [formState]);

    return (
        <EuiForm
            isInvalid={showErrors}
            error={highlightedErrors}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <EuiFormRow
                label="Имя пользователя"
                isInvalid={!!errors.username}
                error={[errors.username?.message]}
            >
                <EuiFieldText
                    disabled={isLoading}
                    isInvalid={!!errors.username}
                    icon="user"
                    {...register('username', {
                        required: {
                            value: true,
                            message: 'Поле с именем пользователя не может быть пустым',
                        },
                        minLength: {
                            value: 5,
                            message:
                                'Минимальная длина поля с именем пользователя 5 символов',
                        },
                        maxLength: {
                            value: 20,
                            message:
                                'Максимальная длина поля с именем пользователя 20 символов',
                        },
                        pattern: {
                            value: /^[A-Za-z0-9]+$/,
                            message: 'Только символы и цифры',
                        },
                    })}
                />
            </EuiFormRow>
            <EuiFormRow label="Имя">
                <EuiFieldText
                    disabled={isLoading}
                    icon="user"
                    {...register('full_name')}
                />
            </EuiFormRow>
            <EuiFormRow
                label="Почта"
                isInvalid={!!errors.email}
                error={[errors.email?.message]}
            >
                <EuiFieldText
                    disabled={isLoading}
                    isInvalid={!!errors.email}
                    icon="email"
                    {...register('email', {
                        required: {
                            value: true,
                            message: 'Поле с почтой не может быть пустым',
                        },
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Некорректная почта',
                        },
                    })}
                />
            </EuiFormRow>

            <EuiFormRow
                label="Пароль"
                isInvalid={!!errors.password}
                error={[errors.password?.message]}
            >
                <EuiFieldPassword
                    disabled={isLoading}
                    autoComplete="off"
                    isInvalid={!!errors.password}
                    id="password"
                    type="dual"
                    aria-required={true}
                    {...register('password', {
                        required: {
                            value: true,
                            message: 'Поле с паролем не может быть пустым',
                        },
                        minLength: {
                            value: 5,
                            message: 'Минимальная длина поля с именем паролем 5 символов',
                        },
                    })}
                />
            </EuiFormRow>

            <EuiFormRow label="Статус">
                <EuiSuperSelect
                    disabled={isLoading}
                    options={options}
                    valueOfSelected={enabled}
                    onChange={(v) => {
                        setEnabled(v);
                    }}
                />
            </EuiFormRow>

            <EuiFormRow label="Доступ">
                <EuiComboBox
                    placeholder="Выберите один или несколько"
                    options={accessOptions}
                    selectedOptions={accesses}
                    onChange={(selectedOptions) => {
                        // @ts-ignore
                        setAccesses(selectedOptions);
                    }}
                />
            </EuiFormRow>
            <EuiSpacer />

            <EuiButton type="submit" isLoading={isLoading}>
                Создать
            </EuiButton>
        </EuiForm>
    );
};

export default NewUserPage;
