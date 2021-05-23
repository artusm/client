import React, {useState} from 'react';
import {
    EuiAvatar,
    EuiFlexGroup,
    EuiFlexItem,
    EuiHeader,
    EuiHeaderBreadcrumbs,
    EuiHeaderLogo,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiHeaderSectionItemButton,
    EuiIcon,
    EuiKeyPadMenu,
    EuiKeyPadMenuItem,
    EuiLink,
    EuiPopover,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { v1 as uuidv1 } from 'uuid';

function htmlIdGenerator(idPrefix: string = '') {
    const staticUuid = uuidv1();
    return (idSuffix: string = '') => {
        const prefix = `${idPrefix}${idPrefix !== '' ? '_' : 'i'}`;
        const suffix = idSuffix ? `_${idSuffix}` : '';
        return `${prefix}${suffix ? staticUuid : uuidv1()}${suffix}`;
    };
}

const Header = () => {
    const renderLogo = () => (
        <EuiHeaderLogo
            iconType="logoElastic"
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-label="Go to home page"
        />
    );

    const renderBreadcrumbs = () => {
        const breadcrumbs = [
            {
                text: 'Главная',
            },
        ];

        return (
            <EuiHeaderBreadcrumbs
                aria-label="Header breadcrumbs example"
                breadcrumbs={breadcrumbs}
            />
        );
    };

    return (
        <EuiHeader>
            <EuiHeaderSection grow={false}>
                <EuiHeaderSectionItem border="right">
                    {renderLogo()}
                </EuiHeaderSectionItem>
            </EuiHeaderSection>

            {renderBreadcrumbs()}

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
            aria-label="Account menu"
            onClick={onMenuButtonClick}>
            <EuiAvatar name="John Username" size="s" />
        </EuiHeaderSectionItemButton>
    );

    return (
        <EuiPopover
            id={id}
            button={button}
            isOpen={isOpen}
            anchorPosition="downRight"
            closePopover={closeMenu}
            panelPaddingSize="none">
            <div style={{ width: 320 }}>
                <EuiFlexGroup
                    gutterSize="m"
                    className="euiHeaderProfile"
                    responsive={false}>
                    <EuiFlexItem grow={false}>
                        <EuiAvatar name="John Username" size="xl" />
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText>
                            <p>John Username</p>
                        </EuiText>

                        <EuiSpacer size="m" />

                        <EuiFlexGroup>
                            <EuiFlexItem>
                                <EuiFlexGroup justifyContent="spaceBetween">
                                    <EuiFlexItem grow={false}>
                                        <EuiLink>Edit profile</EuiLink>
                                    </EuiFlexItem>

                                    <EuiFlexItem grow={false}>
                                        <EuiLink>Log out</EuiLink>
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
            aria-label="Apps menu with 1 new app"
            onClick={onMenuButtonClick}>
            <EuiIcon type="apps" size="m" />
        </EuiHeaderSectionItemButton>
    );

    return (
        <EuiPopover
            id={popoverId}
            button={button}
            isOpen={isOpen}
            anchorPosition="downRight"
            closePopover={closeMenu}>
            <EuiKeyPadMenu id={keypadId} style={{ width: 288 }}>
                <EuiKeyPadMenuItem label="Discover">
                    <EuiIcon type="discoverApp" size="l" />
                </EuiKeyPadMenuItem>

                <EuiKeyPadMenuItem label="Dashboard">
                    <EuiIcon type="dashboardApp" size="l" />
                </EuiKeyPadMenuItem>

                <EuiKeyPadMenuItem label="Dev Tools">
                    <EuiIcon type="devToolsApp" size="l" />
                </EuiKeyPadMenuItem>

                <EuiKeyPadMenuItem label="Machine Learning">
                    <EuiIcon type="machineLearningApp" size="l" />
                </EuiKeyPadMenuItem>

                <EuiKeyPadMenuItem label="Graph">
                    <EuiIcon type="graphApp" size="l" />
                </EuiKeyPadMenuItem>

                <EuiKeyPadMenuItem label="Visualize">
                    <EuiIcon type="visualizeApp" size="l" />
                </EuiKeyPadMenuItem>

                <EuiKeyPadMenuItem label="Timelion" betaBadgeLabel="Beta">
                    <EuiIcon type="timelionApp" size="l" />
                </EuiKeyPadMenuItem>
            </EuiKeyPadMenu>
        </EuiPopover>
    );
};

export default Header;