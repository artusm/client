import React, {FC} from "react";
import {EuiText, EuiListGroup, EuiListGroupItem, EuiButtonEmpty} from "@elastic/eui";

interface Props {
    examples?: string[]
}

export const ExpandedRowFieldHeader = ({ children }: { children: React.ReactNode }) => (
    <EuiText size="xs" color={'subdued'} className={'mlFieldDataCard__valuesTitle'}>
        {children}
    </EuiText>
);

export const ExampleList: FC<Props> = ({ examples }) => {
    if (examples === undefined || examples === null || !Array.isArray(examples)) {
        return null;
    }
    let examplesContent;
    if (examples.length === 0) {
        examplesContent = (
            <span>Примеров нет</span>
        );
    } else {
        examplesContent = examples.map((example, i) => {
            return (
                <EuiListGroupItem
                    className="mlFieldDataCard__codeContent"
                    size="s"
                    key={`example_${i}`}
                    label={example}
                />
            );
        });
    }

    return (
        <div data-test-subj="mlFieldDataExamplesList">
            <ExpandedRowFieldHeader>
                <span>Примеры:</span>
            </ExpandedRowFieldHeader>
            <EuiListGroup showToolTips={true} maxWidth={'s'} gutterSize={'none'} flush={true}>
                {examplesContent}
            </EuiListGroup>
        </div>
    );
};

