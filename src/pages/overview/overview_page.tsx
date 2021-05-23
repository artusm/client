import React, {useState} from 'react';
import Header from "../../components/root/Header";
import {
    EuiPage,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiSuperDatePicker,
    EuiPageBody,
    EuiStat,
    EuiFlexItem,
    EuiFlexGroup,
    EuiPanel,
    EuiIcon,
    EuiSwitch,
    EuiSpacer,

} from '@elastic/eui';

const OverviewPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [start, setStart] = useState('now-30m');
    const [end, setEnd] = useState('now');
    const a = (
        <EuiSuperDatePicker
            start={start}
            end={end}
            onTimeChange={() => {}}
        />
    )
    return (
        <>
            <Header />
            <EuiPage paddingSize="none">
                <EuiPageBody panelled>
                    <EuiPageHeader
                        iconType="globe"
                        pageTitle="Главная"
                        rightSideItems={[a]}
                        description="Restricting the width to 75%."
                    />

                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="transparent"
                        borderRadius="none">
                        <EuiPageContentBody>
                            <EuiFlexGroup>
                                <EuiFlexItem>
                                    <EuiPanel>
                                        <EuiStat
                                            title="8,888"
                                            description="Total widgets"
                                            textAlign="right"
                                            isLoading={isLoading}>
                                            <EuiIcon type="empty" />
                                        </EuiStat>
                                    </EuiPanel>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiPanel>
                                        <EuiStat
                                            title="2,000"
                                            description="Pending widgets"
                                            titleColor="accent"
                                            textAlign="right"
                                            isLoading={isLoading}>
                                            <EuiIcon type="clock" color="accent" />
                                        </EuiStat>
                                    </EuiPanel>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiPanel>
                                        <EuiStat
                                            title="6,800"
                                            description="Success widgets"
                                            titleColor="secondary"
                                            textAlign="right"
                                            isLoading={isLoading}>
                                            <EuiIcon type="check" color="secondary" />
                                        </EuiStat>
                                    </EuiPanel>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiPanel>
                                        <EuiStat
                                            title="88"
                                            description="Error widgets"
                                            titleColor="danger"
                                            textAlign="right"
                                            isLoading={isLoading}>
                                            <EuiIcon type="alert" color="danger" />
                                        </EuiStat>
                                    </EuiPanel>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiPanel>
                                        <EuiStat
                                            title="88"
                                            description="Error widgets"
                                            titleColor="danger"
                                            textAlign="right"
                                            isLoading={isLoading}>
                                            <EuiIcon type="alert" color="danger" />
                                        </EuiStat>
                                    </EuiPanel>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiPanel>
                                        <EuiStat
                                            title="88"
                                            description="Error widgets"
                                            titleColor="danger"
                                            textAlign="right"
                                            isLoading={isLoading}>
                                            <EuiIcon type="alert" color="danger" />
                                        </EuiStat>
                                    </EuiPanel>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    );
};

export default OverviewPage;