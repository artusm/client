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
    EuiHealth, EuiFlexGroup,
} from "@elastic/eui";
import {FieldStatItem} from "./componenets/field-stat-item/field-stat-item";
import useSWR from "swr";


const FieldDataVisualizerPage = () => {
    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: "Аналитика полей",
                    },
                ]}
            />
            <EuiPage paddingSize="none">
                <EuiPageBody panelled>
                    <EuiPageHeader
                        iconType="visBarHorizontalStacked"
                        pageTitle="Аналитика полей"
                        description="Ф"
                    />

                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="transparent"
                        borderRadius="none"
                    >
                        <EuiPageContentBody>
                            <EuiFlexGroup
                                wrap={true}
                                gutterSize="m"
                            >
                                <List />
                            </EuiFlexGroup>
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    );
};


const fetcher = (url: string) => fetch(url).then((res) => res.json());

const List = () => {
    const {data} = useSWR('/api/field-stats', fetcher);

    if (!data) return (<div>Загурзка</div>);

    const {totalCount, fieldStats} = data;

    return (
        <>
            {fieldStats.map((f, i) => (
                <FieldStatItem key={i} type={f.type} fieldName={f.fieldName} data={f} totalCount={totalCount} />
            ))}
        </>
    )
};

export default FieldDataVisualizerPage;
