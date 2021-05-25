import "./login_page.css";
import React from "react";
import { EuiSpacer, EuiTitle, EuiFlexItem, EuiFlexGroup } from "@elastic/eui";
import { LoginForm } from "./components/login_form";
import { useHistory } from "react-router-dom";

const Page = () => {
    const history = useHistory();

    const onSuccessAuth = () => {
        history.push("/");
    };

    return (
        <div className="loginWelcome login-form">
            <header className="loginWelcome__header">
                <div className="loginWelcome__content eui-textCenter">
                    <EuiSpacer size="xxl" />
                    <span className="loginWelcome__logo">
            <img
                src="https://retail.tools/img/14303839_324.png"
                alt="Логотип"
            />
          </span>
                    <EuiTitle size="m" className="loginWelcome__title">
                        <h1>Вход</h1>
                    </EuiTitle>
                    <EuiSpacer size="xl" />
                </div>
            </header>
            <div className="loginWelcome__content loginWelcome-body">
                <EuiFlexGroup gutterSize="l">
                    <EuiFlexItem>
                        <LoginForm onSuccessAuth={onSuccessAuth} />
                    </EuiFlexItem>
                </EuiFlexGroup>
            </div>
        </div>
    );
};

export default Page;
