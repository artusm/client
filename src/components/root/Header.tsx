import React, { useState } from "react";
import {
    EuiAvatar,
    EuiFlexGroup,
    EuiFlexItem,
    EuiHeader,
    EuiHeaderBreadcrumbs,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiHeaderSectionItemButton,
    EuiIcon,
    EuiKeyPadMenu,
    EuiKeyPadMenuItem,
    EuiPopover,
    EuiSpacer,
    EuiText,
    EuiBreadcrumb
} from "@elastic/eui";
import { v1 as uuidv1 } from "uuid";
import { useHistory } from "react-router";
import Link from "../Link";

function htmlIdGenerator(idPrefix: string = "") {
    const staticUuid = uuidv1();
    return (idSuffix: string = "") => {
        const prefix = `${idPrefix}${idPrefix !== "" ? "_" : "i"}`;
        const suffix = idSuffix ? `_${idSuffix}` : "";
        return `${prefix}${suffix ? staticUuid : uuidv1()}${suffix}`;
    };
}

const Header = ({breadcrumbs = []}: {breadcrumbs: EuiBreadcrumb[]}) => {
    return (
        <EuiHeader>
            <EuiHeaderSection grow={false}>
                <EuiHeaderSectionItem border="right">
                    <Link to="/" className="euiHeaderLogo">
                        <img
                            src={"https://retail.tools/img/14303839_324.png"}
                            alt={"logo"}
                            style={{ height: 35 }}
                        />
                    </Link>
                </EuiHeaderSectionItem>
            </EuiHeaderSection>

            <EuiHeaderBreadcrumbs breadcrumbs={breadcrumbs} />

            <EuiHeaderSection side="right">
                <EuiHeaderSectionItem>
                    <HeaderUserMenu />
                </EuiHeaderSectionItem>

                <EuiHeaderSectionItem>
                    <HeaderAppMenu />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
        </EuiHeader>
    );
};

const HeaderUserMenu = () => {
    const id = htmlIdGenerator()();
    const [isOpen, setIsOpen] = useState(false);

    const onMenuButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const button = (
        <EuiHeaderSectionItemButton
            aria-controls={id}
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={onMenuButtonClick}
        >
            <EuiAvatar name="test" size="s" />
        </EuiHeaderSectionItemButton>
    );

    return (
        <EuiPopover
            id={id}
            button={button}
            isOpen={isOpen}
            anchorPosition="downRight"
            closePopover={closeMenu}
            panelPaddingSize="none"
        >
            <div style={{ width: 320 }}>
                <EuiFlexGroup
                    gutterSize="m"
                    className="euiHeaderProfile"
                    responsive={false}
                >
                    <EuiFlexItem grow={false}>
                        <EuiAvatar name="test" size="xl" />
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText>
                            <p>tester</p>
                        </EuiText>

                        <EuiSpacer size="m" />

                        <EuiFlexGroup>
                            <EuiFlexItem>
                                <EuiFlexGroup justifyContent="spaceBetween">
                                    <EuiFlexItem grow={false}>
                                        <Link to='/users/test'>Редактировать</Link>
                                    </EuiFlexItem>

                                    <EuiFlexItem grow={false}>
                                        <Link to='/login'>Выйти</Link>
                                    </EuiFlexItem>
                                </EuiFlexGroup>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiFlexItem>
                </EuiFlexGroup>
            </div>
        </EuiPopover>
    );
};

const HeaderAppMenu = () => {
    const history = useHistory();
    const idGenerator = htmlIdGenerator();
    const popoverId = idGenerator("popover");
    const keypadId = idGenerator("keypad");

    const [isOpen, setIsOpen] = useState(false);

    const onMenuButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const button = (
        <EuiHeaderSectionItemButton
            aria-controls={keypadId}
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={onMenuButtonClick}
        >
            <EuiIcon type="apps" size="m" />
        </EuiHeaderSectionItemButton>
    );

    const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target;

        // @ts-ignore
        const button = target.closest("[data-url]");

        const url = button?.dataset?.url;

        history.push(url);
    };

    return (
        <EuiPopover
            id={popoverId}
            button={button}
            isOpen={isOpen}
            anchorPosition="downRight"
            closePopover={closeMenu}
        >
            <EuiKeyPadMenu id={keypadId} style={{ width: 288 }}>
                <EuiKeyPadMenuItem
                    label="Главаня"
                    data-url="/"
                    // @ts-ignore
                    onClick={onClick}
                >
                    <EuiIcon type="discoverApp" size="l" />
                </EuiKeyPadMenuItem>
                <EuiKeyPadMenuItem
                    label="Аналитика полей"
                    data-url="/field-stats"
                    // @ts-ignore
                    onClick={onClick}
                >
                    <EuiIcon type="visBarHorizontalStacked" size="l" />
                </EuiKeyPadMenuItem>
                <EuiKeyPadMenuItem
                    label="Мониторинг температуры ценников"
                    data-url="/temp-stat"
                    // @ts-ignore
                    onClick={onClick}
                >
                    <EuiIcon type="monitoringApp" size="l" />
                </EuiKeyPadMenuItem>

                <EuiKeyPadMenuItem
                    label="Статистика темпа добавления логов"
                    data-url="/stat"
                    // @ts-ignore
                    onClick={onClick}
                >
                    <EuiIcon type="visualizeApp" size="l" />
                </EuiKeyPadMenuItem>
                <EuiKeyPadMenuItem
                    label="Логи с аномалиями"
                    data-url="/anomaly-logs"
                    // @ts-ignore
                    onClick={onClick}
                >
                    <EuiIcon type="sqlApp" size="l" />
                </EuiKeyPadMenuItem>

                <EuiKeyPadMenuItem
                    label="Пользователи"
                    data-url="/users"
                    // @ts-ignore
                    onClick={onClick}
                >
                    <EuiIcon type="users" size="l" />
                </EuiKeyPadMenuItem>

                <EuiKeyPadMenuItem
                    label="Создать нового пользователя"
                    data-url="/users/new"
                    // @ts-ignore
                    onClick={onClick}
                >
                    <EuiIcon type="user" size="l" />
                </EuiKeyPadMenuItem>
            </EuiKeyPadMenu>
        </EuiPopover>
    );
};

export default Header;
