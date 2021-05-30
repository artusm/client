import React, {FC, useMemo, useState} from 'react';
import {
    EuiAvatar,
    EuiBreadcrumb,
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
} from '@elastic/eui';
import {v1 as uuidv1} from 'uuid';
import {useHistory} from 'react-router';

import Link from '../Link';
import {useAuthContext} from "../../containers/auth";
import {Permissions} from "../../common/permissions";

function htmlIdGenerator(idPrefix: string = '') {
    const staticUuid = uuidv1();
    return (idSuffix: string = '') => {
        const prefix = `${idPrefix}${idPrefix !== '' ? '_' : 'i'}`;
        const suffix = idSuffix ? `_${idSuffix}` : '';
        return `${prefix}${suffix ? staticUuid : uuidv1()}${suffix}`;
    };
}

const Header = ({ breadcrumbs = [] }: { breadcrumbs: EuiBreadcrumb[] }) => {
    const {currentUser, can} = useAuthContext();

    return (
        <EuiHeader>
            <EuiHeaderSection grow={false}>
                <EuiHeaderSectionItem border="right">
                    <Link to="/" className="euiHeaderLogo">
                        <img
                            src="https://retail.tools/img/14303839_324.png"
                            alt="logo"
                            style={{ height: 35 }}
                        />
                    </Link>
                </EuiHeaderSectionItem>
            </EuiHeaderSection>

            <EuiHeaderBreadcrumbs breadcrumbs={breadcrumbs} />

            <EuiHeaderSection side="right">
                <EuiHeaderSectionItem>
                    <HeaderUserMenu username={currentUser?.username ?? ''} />
                </EuiHeaderSectionItem>

                <EuiHeaderSectionItem>
                    <HeaderAppMenu can={can} />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
        </EuiHeader>
    );
};

const HeaderUserMenu = ({ username }) => {
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
            <EuiAvatar name={username} size="s" />
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
                        <EuiAvatar name={username} size="xl" />
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText>
                            <p>{username}</p>
                        </EuiText>

                        <EuiSpacer size="m" />

                        <EuiFlexGroup>
                            <EuiFlexItem>
                                <EuiFlexGroup justifyContent="spaceBetween">
                                    <EuiFlexItem grow={false}>
                                        <Link to={`/users/${username}`}>Редактировать</Link>
                                    </EuiFlexItem>

                                    <EuiFlexItem grow={false}>
                                        <Link to="/login">Выйти</Link>
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

interface HeaderAppMenuProps {
    can: (permission: string) => boolean
}

const menuItems = [
    {
        label: 'Главаня',
        url: '/',
        icon: 'discoverApp'
    },
    {
        label: 'Аналитика полей',
        url: '/field-stats',
        icon: 'visBarHorizontalStacked',
        permission: Permissions.ACCESS_TO_FIELD_STATS,
    },
    {
        label: 'Мониторинг температуры ценников',
        url: '/temp-stat',
        icon: 'monitoringApp',
        permission: Permissions.ACCESS_TO_TEMP_STAT
    },
    {
        label: 'Статистика темпа добавления логов',
        url: '/stat',
        icon: 'visualizeApp',
        permission: Permissions.ACCESS_TO_RATE_STAT
    },
    {
        label: 'Логи с аномалиями',
        url: '/anomaly-logs',
        icon: 'sqlApp',
        permission: Permissions.ACCESS_TO_ANOMALY_LOGS
    },
    {
        label: 'Пользователи',
        url: '/users',
        icon: 'users',
        permission: Permissions.VIEW_USER_LIST
    },
    {
        label: 'Создать нового пользователя',
        url: '/users/new',
        icon: 'user',
        permission: Permissions.CREATE_USER,
    },
]

const HeaderAppMenu: FC<HeaderAppMenuProps> = ({can}) => {
    const history = useHistory();
    const idGenerator = htmlIdGenerator();
    const popoverId = idGenerator('popover');
    const keypadId = idGenerator('keypad');

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
        const button = target.closest('[data-url]');

        const url = button?.dataset?.url;

        history.push(url);
    };

    const items = useMemo(() => {
        return menuItems.filter(({permission}) => {
            if (permission) {
                return can(permission)
            }

            return true;
        });
    }, [can]);


    return (
        <EuiPopover
            id={popoverId}
            button={button}
            isOpen={isOpen}
            anchorPosition="downRight"
            closePopover={closeMenu}
        >
            <EuiKeyPadMenu id={keypadId} style={{ width: 288 }}>
                {items.map(({label, url, icon}) => (
                    <EuiKeyPadMenuItem
                        label={label}
                        data-url={url}
                        // @ts-ignore
                        onClick={onClick}
                    >
                        <EuiIcon type={icon} size="l" />
                    </EuiKeyPadMenuItem>
                ))}
            </EuiKeyPadMenu>
        </EuiPopover>
    );
};

export default Header;
