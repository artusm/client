import React, {useState, useMemo, FC} from "react";
import Header from "../../components/root/Header";
import useSWR, { mutate } from "swr";
import {
    EuiPage,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiPageBody,
    EuiFormRow,
    EuiSpacer,
    EuiForm,
    EuiButton,
    EuiHealth,
    EuiSuperSelect,
    EuiFieldText,
    EuiComboBox
} from "@elastic/eui";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";

const OverviewPage = () => {
    // @ts-ignore
    const { username } = useParams();
    const {data} = useSWR(`/api/users/${username}`);
    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: "Список пользователей",
                    },
                    {
                        text: "Редактирование пользователя",
                    },
                ]}
            />
            <EuiPage paddingSize="none">
                <EuiPageBody panelled>
                    <EuiPageHeader
                        iconType="user"
                        pageTitle="Новый пользователь"
                        description="Редактирование пользователя"
                    />

                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="transparent"
                        borderRadius="none"
                    >
                        <EuiPageContentBody>
                            {data ? <EditUserForm user={data} /> : <div>Загрузка</div>}
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    );
};

const options = [
    {
        value: "true",
        inputDisplay: (
            <EuiHealth color="success" style={{ lineHeight: "inherit" }}>
                Активен
            </EuiHealth>
        ),
    },
    {
        value: "false",
        inputDisplay: (
            <EuiHealth color="danger" style={{ lineHeight: "inherit" }}>
                Диактивен
            </EuiHealth>
        ),
    },
];

const accessOptions = [
    {
        label: 'Редактировать пользователей',
        value: 'edit_users',
    },
    {
        label: 'Доступ к анализу аномальных логов',
        value: 'access_anomaly_logs',
    },
    {
        label: 'Доступ к анализу полей',
        value: 'access_field_analyse',
    },
    {
        label: 'Доступ к списку пользователей',
        value: 'user_list',
    }
]
interface User {
    id: string;
    enabled?: boolean
    username: string;
    password: string;
    full_name: string;
    permissions: string[];
    email: string
}

interface Props {
    user?: User
}
const EditUserForm: FC<Props> = ({user}) => {
    const [enabled, setEnabled] = useState(() => user?.enabled ? 'true' : 'false');
    const [accesses, setAccesses] = useState<any>(() => {
        if (user?.permissions) {
            return user.permissions.map((p) => accessOptions.find((a) => p === a.value));
        }

        return [];
    });
    const { register, formState, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const { errors } = formState;
    const onSubmit = async ({ email, username, password, full_name }) => {
        setIsLoading(true);

        const data = await fetch(`/api/users/${user!.id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                enabled: enabled === "true",
                email,
                username,
                password,
                full_name,
                permissions: accesses.map((a: any) => a.value),
            }),
        });

        setIsLoading(false);
        const json: any = await data.json();
        console.log(json)
        if (json.updated) {
            mutate("/api/users");
            mutate(`/api/users/${user!.id}`)
            history.push(`/users`);
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
            {JSON.stringify(user)}
            <EuiFormRow
                label="Имя пользователя"
                isInvalid={!!errors.username}
                error={[errors.username?.message]}
            >
                <EuiFieldText
                    disabled={isLoading}
                    isInvalid={!!errors.username}
                    icon={"user"}
                    defaultValue={user?.username}
                    {...register("username", {
                        required: {
                            value: true,
                            message: "Поле с именем пользователя не может быть пустым",
                        },
                        minLength: {
                            value: 5,
                            message:
                                "Минимальная длина поля с именем пользователя 5 символов",
                        },
                        maxLength: {
                            value: 20,
                            message:
                                "Максимальная длина поля с именем пользователя 20 символов",
                        },
                        pattern: {
                            value: /^[A-Za-z0-9]+$/,
                            message: "Только символы и цифры",
                        },
                    })}
                />
            </EuiFormRow>
            <EuiFormRow label="Имя">
                <EuiFieldText
                    disabled={isLoading}
                    icon={"user"}
                    defaultValue={user?.full_name}
                    {...register("full_name")}
                />
            </EuiFormRow>
            <EuiFormRow
                label="Почта"
                isInvalid={!!errors.email}
                defaultValue={user?.email}
                error={[errors.email?.message]}
            >
                <EuiFieldText
                    disabled={isLoading}
                    isInvalid={!!errors.email}
                    icon={"email"}
                    defaultValue={user?.email}
                    {...register("email", {
                        required: {
                            value: true,
                            message: "Поле с почтой не может быть пустым",
                        },
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Некорректная почта",
                        },
                    })}
                />
            </EuiFormRow>

            <EuiFormRow label="Статус">
                <EuiSuperSelect
                    disabled={isLoading}
                    options={options}
                    // @ts-ignore
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

            <EuiButton type={"submit"} isLoading={isLoading}>
                Обновить
            </EuiButton>
        </EuiForm>
    );
};

export default OverviewPage;
