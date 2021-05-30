import {
    EuiButton,
    EuiCallOut,
    EuiFieldPassword,
    EuiFieldText,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiLink,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import React, { Component, Fragment } from 'react';

import { LoginValidator } from '../helpers/login_validator';
import { delay } from '../../../utils/delay';

interface Props {
    onSuccessAuth?: (user: any) => void;
}

interface State {
    loadingState: { type: LoadingStateType.None | LoadingStateType.Form };
    username: string;
    password: string;
    message:
        | { type: MessageType.None }
        | { type: MessageType.Danger | MessageType.Info; content: string };
    mode: PageMode;
    previousMode: PageMode;
}

enum LoadingStateType {
    None,
    Form,
}

export enum MessageType {
    None,
    Info,
    Danger,
}

export enum PageMode {
    Form,
    LoginHelp,
}

export class LoginForm extends Component<Props, State> {
    private readonly validator: LoginValidator;

    constructor(props: Props) {
        super(props);
        this.validator = new LoginValidator({ shouldValidate: false });

        const mode = PageMode.Form;

        this.state = {
            loadingState: { type: LoadingStateType.None },
            username: '',
            password: '',
            message: { type: MessageType.None },
            mode,
            previousMode: mode,
        };
    }

    public render() {
        return (
            <Fragment>
                {this.renderMessage()}
                {this.renderContent()}
                {this.renderPageModeSwitchLink()}
            </Fragment>
        );
    }

    private renderMessage = () => {
        const { message } = this.state;
        if (message.type === MessageType.Danger) {
            return (
                <Fragment>
                    <EuiCallOut
                        size="s"
                        color="danger"
                        title={message.content}
                        role="alert"
                    />
                    <EuiSpacer size="l" />
                </Fragment>
            );
        }

        if (message.type === MessageType.Info) {
            return (
                <Fragment>
                    <EuiCallOut
                        size="s"
                        color="primary"
                        title={message.content}
                        role="status"
                    />
                    <EuiSpacer size="l" />
                </Fragment>
            );
        }

        return null;
    };

    public renderContent() {
        switch (this.state.mode) {
            case PageMode.Form:
                return this.renderLoginForm();
            case PageMode.LoginHelp:
                return this.renderLoginHelp();
        }
    }

    private renderLoginForm = () => {
        return (
            <EuiPanel>
                <form onSubmit={this.submitLoginForm}>
                    <EuiFormRow
                        label="Логин"
                        {...this.validator.validateUsername(this.state.username)}
                    >
                        <EuiFieldText
                            autoComplete="off"
                            id="username"
                            icon="user"
                            name="username"
                            value={this.state.username}
                            onChange={this.onUsernameChange}
                            disabled={!this.isLoadingState(LoadingStateType.None)}
                            isInvalid={false}
                            aria-required={true}
                            inputRef={this.setUsernameInputRef}
                        />
                    </EuiFormRow>

                    <EuiFormRow
                        label="Пароль"
                        {...this.validator.validatePassword(this.state.password)}
                    >
                        <EuiFieldPassword
                            autoComplete="off"
                            id="password"
                            name="password"
                            type="dual"
                            value={this.state.password}
                            onChange={this.onPasswordChange}
                            disabled={!this.isLoadingState(LoadingStateType.None)}
                            isInvalid={false}
                            aria-required={true}
                        />
                    </EuiFormRow>

                    <EuiSpacer />

                    <EuiFlexGroup
                        responsive={false}
                        alignItems="center"
                        gutterSize="s"
                        justifyContent="spaceAround"
                    >
                        <EuiFlexItem grow={false}>
                            <EuiButton
                                fill
                                type="submit"
                                color="primary"
                                onClick={this.submitLoginForm}
                                isDisabled={!this.isLoadingState(LoadingStateType.None)}
                                isLoading={this.isLoadingState(LoadingStateType.Form)}
                            >
                                Войти
                            </EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </form>
            </EuiPanel>
        );
    };

    private renderLoginHelp = () => {
        return (
            <EuiPanel>
                <EuiText>Логин для входа tester</EuiText>
                <EuiText>Пароль test</EuiText>
            </EuiPanel>
        );
    };

    private renderPageModeSwitchLink = () => {
        if (this.state.mode === PageMode.LoginHelp) {
            return (
                <Fragment>
                    <EuiSpacer />
                    <EuiText size="xs" className="eui-textCenter">
                        <EuiLink
                            onClick={() => this.onPageModeChange(this.state.previousMode)}
                        >
                            Назад к логину
                        </EuiLink>
                    </EuiText>
                </Fragment>
            );
        }

        return (
            <Fragment>
                <EuiSpacer />
                <EuiText size="xs" className="eui-textCenter">
                    <EuiLink onClick={() => this.onPageModeChange(PageMode.LoginHelp)}>
                        Помощь
                    </EuiLink>
                </EuiText>
            </Fragment>
        );
    };

    private setUsernameInputRef(ref: HTMLInputElement) {
        if (ref) {
            ref.focus();
        }
    }

    private onPageModeChange = (mode: PageMode) => {
        this.setState({
            message: { type: MessageType.None },
            mode,
            previousMode: this.state.mode,
        });
    };

    private onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            username: e.target.value,
        });
    };

    private onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            password: e.target.value,
        });
    };

    private submitLoginForm = async (
        e: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        this.validator.enableValidation();

        const { username, password } = this.state;
        if (this.validator.validateForLogin(username, password).isInvalid) {
            return this.forceUpdate();
        }

        this.setState({
            loadingState: { type: LoadingStateType.Form },
            message: { type: MessageType.None },
        });

        await delay();

        try {
            const d = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const json = await d.json();

            if (json && json?.success) {
                this.setState({
                    loadingState: { type: LoadingStateType.None },
                    message: { type: MessageType.Info, content: 'Вы успешно вошли' },
                });
                if (this.props.onSuccessAuth) {
                    this.props.onSuccessAuth(json.user);
                }
            } else {
                this.setState({
                    message: {
                        type: MessageType.Danger,
                        content: 'Некорректный логин или пароль',
                    },
                    loadingState: { type: LoadingStateType.None },
                });
            }
        } catch (error) {
            const message = 'Ошибка! Что-то пошло не так';

            this.setState({
                message: { type: MessageType.Danger, content: message },
                loadingState: { type: LoadingStateType.None },
            });
        }
    };

    private isLoadingState(
        type: LoadingStateType.None | LoadingStateType.Form
    ): boolean;
    private isLoadingState(type: LoadingStateType) {
        const { loadingState } = this.state;

        return loadingState.type === type;
    }
}
