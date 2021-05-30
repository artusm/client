import { ReactWrapper } from 'enzyme';

type Matcher = '=' | '~=' | '|=' | '^=' | '$=' | '*=';

const MATCHERS: Matcher[] = [
    '=', // Exact match
    '~=', // Exists in a space-separated list
    '|=', // Begins with substring, followed by '-'
    '^=', // Begins with substring
    '$=', // Ends with substring
    '*=',
];


export const findTestSubject = <T = string>(
    reactWrapper: ReactWrapper,
    testSubjectSelector: T,
    matcher: Matcher = '~='
) => {
    if (!MATCHERS.includes(matcher)) {
        throw new Error(
            'Matcher '
                .concat(matcher, ' not found in list of allowed matchers: ')
                .concat(MATCHERS.join(' '))
        );
    }

    const testSubject = reactWrapper.find(`[data-test-subj${matcher}"${testSubjectSelector}"]`);

    return testSubject.hostNodes();
};
