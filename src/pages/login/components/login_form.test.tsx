// import { EuiButton, EuiCallOut, EuiIcon } from '@elastic/eui';
// import { act } from '@testing-library/react';
// import type { ReactWrapper } from 'enzyme';
// import { shallow, mount } from 'enzyme'
// import React from 'react';
//
// import {findTestSubject} from '../../../utils/test/find_test_subject';
//
// import { nextTick } from '@kbn/test/jest';
// import { coreMock } from 'src/core/public/mocks';
//
// import { LoginForm, MessageType, PageMode } from './login_form';
//
// function expectPageMode(wrapper: ReactWrapper, mode: PageMode) {
//     const assertions: Array<[string, boolean]> =
//         mode === PageMode.Form
//             ? [
//                 ['loginForm', true],
//                 ['loginSelector', false],
//                 ['loginHelp', false],
//                 ['autoLoginOverlay', false],
//             ]
//             : [
//                 ['loginForm', false],
//                 ['loginSelector', false],
//                 ['loginHelp', true],
//                 ['autoLoginOverlay', false],
//             ];
//     for (const [selector, exists] of assertions) {
//         expect(findTestSubject(wrapper, selector).exists()).toBe(exists);
//     }
// }
//
// function expectAutoLoginOverlay(wrapper: ReactWrapper) {
//     // Everything should be hidden except for the overlay
//     for (const selector of [
//         'loginForm',
//         'loginSelector',
//         'loginHelp',
//         'loginHelpLink',
//         'loginAssistanceMessage',
//     ]) {
//         expect(findTestSubject(wrapper, selector).exists()).toBe(false);
//     }
//     expect(findTestSubject(wrapper, 'autoLoginOverlay').exists()).toBe(true);
// }
//
// describe('LoginForm', () => {
//     beforeAll(() => {
//         Object.defineProperty(window, 'location', {
//             value: { href: 'https://some-host/bar' },
//             writable: true,
//         });
//     });
//
//     it('renders as expected', () => {
//         expect(
//             shallow(
//                 <LoginForm
//                     onSuccessAuth={() => {}}
//                 />
//             )
//         ).toMatchSnapshot();
//     });
//
//
//     it('renders `Need help?` link if login help text is provided.', () => {
//         const wrapper = mount(
//             <LoginForm
//                 onSuccessAuth={() => {}}
//             />
//         );
//
//         expectPageMode(wrapper, PageMode.Form);
//
//         expect(findTestSubject(wrapper, 'loginHelpLink').text()).toEqual('Помощь');
//     });
//
//     it('renders an invalid credentials message', async () => {
//         const wrapper = mount(
//             <LoginForm
//             />
//         );
//
//         expectPageMode(wrapper, PageMode.Form);
//
//         wrapper.find('input[name="username"]').simulate('change', { target: { value: 'username' } });
//         wrapper.find('input[name="password"]').simulate('change', { target: { value: 'password' } });
//         wrapper.find(EuiButton).simulate('click');
//
//         await act(async () => {
//             await nextTick();
//             wrapper.update();
//         });
//
//         expect(wrapper.find(EuiCallOut).props().title).toEqual(
//             `Username or password is incorrect. Please try again.`
//         );
//     });
//
//     it('renders unknown error message', async () => {
//         const wrapper = mount(
//             <LoginForm
//
//             />
//         );
//
//         expectPageMode(wrapper, PageMode.Form);
//
//         wrapper.find('input[name="username"]').simulate('change', { target: { value: 'username' } });
//         wrapper.find('input[name="password"]').simulate('change', { target: { value: 'password' } });
//         wrapper.find(EuiButton).simulate('click');
//
//         await act(async () => {
//             await nextTick();
//             wrapper.update();
//         });
//
//         expect(wrapper.find(EuiCallOut).props().title).toEqual(`Oops! Error. Try again.`);
//     });
//
//     it('properly redirects after successful login', async () => {
//         window.location.href = `https://some-host/login?next=${encodeURIComponent(
//             '/some-base-path/app/home#/?_g=()'
//         )}`;
//         const coreStartMock = coreMock.createStart({ basePath: '/some-base-path' });
//         coreStartMock.http.post.mockResolvedValue({ location: '/some-base-path/app/home#/?_g=()' });
//
//         const wrapper = mount(
//             <LoginForm
//
//             />
//         );
//
//         expectPageMode(wrapper, PageMode.Form);
//
//         wrapper.find('input[name="username"]').simulate('change', { target: { value: 'username1' } });
//         wrapper.find('input[name="password"]').simulate('change', { target: { value: 'password1' } });
//         wrapper.find(EuiButton).simulate('click');
//
//         await act(async () => {
//             await nextTick();
//             wrapper.update();
//         });
//
//
//         expect(window.location.href).toBe('/some-base-path/app/home#/?_g=()');
//         expect(wrapper.find(EuiCallOut).exists()).toBe(false);
//     });
//
//     it('properly switches to login help', async () => {
//         const wrapper = mount(
//             <LoginForm
//             />
//         );
//
//         expectPageMode(wrapper, PageMode.Form);
//         expect(findTestSubject(wrapper, 'loginBackToSelector').exists()).toBe(false);
//
//         // Going to login help.
//         findTestSubject(wrapper, 'loginHelpLink').simulate('click');
//         wrapper.update();
//         expectPageMode(wrapper, PageMode.LoginHelp);
//
//
//         // Going back to login form.
//         findTestSubject(wrapper, 'loginBackToLoginLink').simulate('click');
//         wrapper.update();
//         expectPageMode(wrapper, PageMode.Form);
//         expect(findTestSubject(wrapper, 'loginBackToSelector').exists()).toBe(false);
//     });
//
//     describe('login selector', () => {
//         it('renders as expected with providers that use login form', async () => {
//             const coreStartMock = coreMock.createStart();
//             const wrapper = mount(
//                 <LoginForm
//                     http={coreStartMock.http}
//                     notifications={coreStartMock.notifications}
//                     loginAssistanceMessage=""
//                     selector={{
//                         enabled: true,
//                         providers: [
//                             {
//                                 type: 'basic',
//                                 name: 'basic',
//                                 usesLoginForm: true,
//                                 hint: 'Basic hint',
//                                 icon: 'logoElastic',
//                                 showInSelector: true,
//                             },
//                             {
//                                 type: 'saml',
//                                 name: 'saml1',
//                                 description: 'Log in w/SAML',
//                                 usesLoginForm: false,
//                                 showInSelector: true,
//                             },
//                             {
//                                 type: 'pki',
//                                 name: 'pki1',
//                                 description: 'Log in w/PKI',
//                                 hint: 'PKI hint',
//                                 usesLoginForm: false,
//                                 showInSelector: true,
//                             },
//                         ],
//                     }}
//                 />
//             );
//
//             expectPageMode(wrapper, PageMode.Selector);
//
//             expect(
//                 wrapper.find('.secLoginCard').map((card) => {
//                     const hint = card.find('.secLoginCard__hint');
//                     return {
//                         title: card.find('p.secLoginCard__title').text(),
//                         hint: hint.exists() ? hint.text() : '',
//                         icon: card.find(EuiIcon).props().type,
//                     };
//                 })
//             ).toEqual([
//                 { title: 'Log in with basic/basic', hint: 'Basic hint', icon: 'logoElastic' },
//                 { title: 'Log in w/SAML', hint: '', icon: 'empty' },
//                 { title: 'Log in w/PKI', hint: 'PKI hint', icon: 'empty' },
//             ]);
//         });
//
//         it('renders as expected without providers that use login form', async () => {
//             const coreStartMock = coreMock.createStart();
//             const wrapper = mount(
//                 <LoginForm
//                     http={coreStartMock.http}
//                     notifications={coreStartMock.notifications}
//                     loginAssistanceMessage=""
//                     selector={{
//                         enabled: true,
//                         providers: [
//                             {
//                                 type: 'saml',
//                                 name: 'saml1',
//                                 description: 'Login w/SAML',
//                                 hint: 'SAML hint',
//                                 usesLoginForm: false,
//                                 showInSelector: true,
//                             },
//                             {
//                                 type: 'pki',
//                                 name: 'pki1',
//                                 icon: 'some-icon',
//                                 usesLoginForm: false,
//                                 showInSelector: true,
//                             },
//                         ],
//                     }}
//                 />
//             );
//
//             expectPageMode(wrapper, PageMode.Selector);
//
//             expect(
//                 wrapper.find('.secLoginCard').map((card) => {
//                     const hint = card.find('.secLoginCard__hint');
//                     return {
//                         title: card.find('p.secLoginCard__title').text(),
//                         hint: hint.exists() ? hint.text() : '',
//                         icon: card.find(EuiIcon).props().type,
//                     };
//                 })
//             ).toEqual([
//                 { title: 'Login w/SAML', hint: 'SAML hint', icon: 'empty' },
//                 { title: 'Log in with pki/pki1', hint: '', icon: 'some-icon' },
//             ]);
//         });
//
//         it('properly redirects after successful login', async () => {
//             const currentURL = `https://some-host/login?next=${encodeURIComponent(
//                 '/some-base-path/app/kibana#/home?_g=()'
//             )}`;
//
//             const coreStartMock = coreMock.createStart({ basePath: '/some-base-path' });
//             coreStartMock.http.post.mockResolvedValue({
//                 location: 'https://external-idp/login?optional-arg=2#optional-hash',
//             });
//
//             window.location.href = currentURL;
//             const wrapper = mount(
//                 <LoginForm
//                     http={coreStartMock.http}
//                     notifications={coreStartMock.notifications}
//                     loginAssistanceMessage=""
//                     selector={{
//                         enabled: true,
//                         providers: [
//                             { type: 'basic', name: 'basic', usesLoginForm: true, showInSelector: true },
//                             {
//                                 type: 'saml',
//                                 name: 'saml1',
//                                 description: 'Login w/SAML',
//                                 usesLoginForm: false,
//                                 showInSelector: true,
//                             },
//                             {
//                                 type: 'pki',
//                                 name: 'pki1',
//                                 description: 'Login w/PKI',
//                                 usesLoginForm: false,
//                                 showInSelector: true,
//                             },
//                         ],
//                     }}
//                 />
//             );
//
//             expectPageMode(wrapper, PageMode.Selector);
//
//             wrapper.findWhere((node) => node.key() === 'saml1').simulate('click');
//
//             await act(async () => {
//                 await nextTick();
//                 wrapper.update();
//             });
//
//             expect(coreStartMock.http.post).toHaveBeenCalledTimes(1);
//             expect(coreStartMock.http.post).toHaveBeenCalledWith('/internal/security/login', {
//                 body: JSON.stringify({ providerType: 'saml', providerName: 'saml1', currentURL }),
//             });
//
//             expect(window.location.href).toBe('https://external-idp/login?optional-arg=2#optional-hash');
//             expect(wrapper.find(EuiCallOut).exists()).toBe(false);
//             expect(coreStartMock.notifications.toasts.addError).not.toHaveBeenCalled();
//         });
//
//         it('shows error toast if login fails', async () => {
//             const currentURL = `https://some-host/login?next=${encodeURIComponent(
//                 '/some-base-path/app/kibana#/home?_g=()'
//             )}`;
//
//             const failureReason = new Error('Oh no!');
//             const coreStartMock = coreMock.createStart({ basePath: '/some-base-path' });
//             coreStartMock.http.post.mockRejectedValue(failureReason);
//
//             window.location.href = currentURL;
//             const wrapper = mount(
//                 <LoginForm
//                     http={coreStartMock.http}
//                     notifications={coreStartMock.notifications}
//                     loginAssistanceMessage=""
//                     selector={{
//                         enabled: true,
//                         providers: [
//                             { type: 'basic', name: 'basic', usesLoginForm: true, showInSelector: true },
//                             { type: 'saml', name: 'saml1', usesLoginForm: false, showInSelector: true },
//                         ],
//                     }}
//                 />
//             );
//
//             expectPageMode(wrapper, PageMode.Selector);
//
//             wrapper.findWhere((node) => node.key() === 'saml1').simulate('click');
//
//             await act(async () => {
//                 await nextTick();
//                 wrapper.update();
//             });
//
//             expect(coreStartMock.http.post).toHaveBeenCalledTimes(1);
//             expect(coreStartMock.http.post).toHaveBeenCalledWith('/internal/security/login', {
//                 body: JSON.stringify({ providerType: 'saml', providerName: 'saml1', currentURL }),
//             });
//
//             expect(window.location.href).toBe(currentURL);
//             expect(coreStartMock.notifications.toasts.addError).toHaveBeenCalledWith(failureReason, {
//                 title: 'Could not perform login.',
//                 toastMessage: 'Oh no!',
//             });
//         });
//
//         it('shows error with message in the `body`', async () => {
//             const currentURL = `https://some-host/login?next=${encodeURIComponent(
//                 '/some-base-path/app/kibana#/home?_g=()'
//             )}`;
//
//             const coreStartMock = coreMock.createStart({ basePath: '/some-base-path' });
//             coreStartMock.http.post.mockRejectedValue({
//                 body: { message: 'Oh no! But with much more details!' },
//                 message: 'Oh no!',
//             });
//
//             window.location.href = currentURL;
//             const wrapper = mount(
//                 <LoginForm
//                     http={coreStartMock.http}
//                     notifications={coreStartMock.notifications}
//                     loginAssistanceMessage=""
//                     selector={{
//                         enabled: true,
//                         providers: [
//                             { type: 'basic', name: 'basic', usesLoginForm: true, showInSelector: true },
//                             { type: 'saml', name: 'saml1', usesLoginForm: false, showInSelector: true },
//                         ],
//                     }}
//                 />
//             );
//
//             expectPageMode(wrapper, PageMode.Selector);
//
//             wrapper.findWhere((node) => node.key() === 'saml1').simulate('click');
//
//             await act(async () => {
//                 await nextTick();
//                 wrapper.update();
//             });
//
//             expect(coreStartMock.http.post).toHaveBeenCalledTimes(1);
//             expect(coreStartMock.http.post).toHaveBeenCalledWith('/internal/security/login', {
//                 body: JSON.stringify({ providerType: 'saml', providerName: 'saml1', currentURL }),
//             });
//
//             expect(window.location.href).toBe(currentURL);
//             expect(coreStartMock.notifications.toasts.addError).toHaveBeenCalledWith(
//                 new Error('Oh no! But with much more details!'),
//                 { title: 'Could not perform login.', toastMessage: 'Oh no!' }
//             );
//         });
//
//         it('properly switches to login form', async () => {
//             const currentURL = `https://some-host/login?next=${encodeURIComponent(
//                 '/some-base-path/app/kibana#/home?_g=()'
//             )}`;
//
//             const coreStartMock = coreMock.createStart({ basePath: '/some-base-path' });
//             window.location.href = currentURL;
//             const wrapper = mount(
//                 <LoginForm
//                     http={coreStartMock.http}
//                     notifications={coreStartMock.notifications}
//                     loginAssistanceMessage=""
//                     selector={{
//                         enabled: true,
//                         providers: [
//                             { type: 'basic', name: 'basic', usesLoginForm: true, showInSelector: true },
//                             { type: 'saml', name: 'saml1', usesLoginForm: false, showInSelector: true },
//                         ],
//                     }}
//                 />
//             );
//
//             expectPageMode(wrapper, PageMode.Selector);
//
//             wrapper.findWhere((node) => node.key() === 'basic').simulate('click');
//             wrapper.update();
//             expectPageMode(wrapper, PageMode.Form);
//
//             expect(coreStartMock.http.post).not.toHaveBeenCalled();
//             expect(coreStartMock.notifications.toasts.addError).not.toHaveBeenCalled();
//             expect(window.location.href).toBe(currentURL);
//         });
//
//         it('properly switches to login help', async () => {
//             const coreStartMock = coreMock.createStart({ basePath: '/some-base-path' });
//             const wrapper = mount(
//                 <LoginForm
//                     http={coreStartMock.http}
//                     notifications={coreStartMock.notifications}
//                     loginAssistanceMessage=""
//                     loginHelp="**some help**"
//                     selector={{
//                         enabled: true,
//                         providers: [
//                             { type: 'basic', name: 'basic', usesLoginForm: true, showInSelector: true },
//                             { type: 'saml', name: 'saml1', usesLoginForm: false, showInSelector: true },
//                         ],
//                     }}
//                 />
//             );
//
//             expectPageMode(wrapper, PageMode.Selector);
//
//             findTestSubject(wrapper, 'loginHelpLink').simulate('click');
//             wrapper.update();
//             expectPageMode(wrapper, PageMode.LoginHelp);
//
//
//             // Going back to login selector.
//             findTestSubject(wrapper, 'loginBackToLoginLink').simulate('click');
//             wrapper.update();
//             expectPageMode(wrapper, PageMode.Selector);
//
//             expect(coreStartMock.http.post).not.toHaveBeenCalled();
//             expect(coreStartMock.notifications.toasts.addError).not.toHaveBeenCalled();
//         });
//
//         it('properly switches to login form -> login help and back', async () => {
//             const coreStartMock = coreMock.createStart({ basePath: '/some-base-path' });
//             const wrapper = mount(
//                 <LoginForm
//                     http={coreStartMock.http}
//                     notifications={coreStartMock.notifications}
//                     loginAssistanceMessage=""
//                     loginHelp="**some help**"
//                     selector={{
//                         enabled: true,
//                         providers: [
//                             { type: 'basic', name: 'basic', usesLoginForm: true, showInSelector: true },
//                             { type: 'saml', name: 'saml1', usesLoginForm: false, showInSelector: true },
//                         ],
//                     }}
//                 />
//             );
//
//             expectPageMode(wrapper, PageMode.Selector);
//
//             // Going to login form.
//             wrapper.findWhere((node) => node.key() === 'basic').simulate('click');
//             wrapper.update();
//             expectPageMode(wrapper, PageMode.Form);
//
//             // Going to login help.
//             findTestSubject(wrapper, 'loginHelpLink').simulate('click');
//             wrapper.update();
//             expectPageMode(wrapper, PageMode.LoginHelp);
//
//
//             // Going back to login form.
//             findTestSubject(wrapper, 'loginBackToLoginLink').simulate('click');
//             wrapper.update();
//             expectPageMode(wrapper, PageMode.Form);
//
//             // Going back to login selector.
//             findTestSubject(wrapper, 'loginBackToSelector').simulate('click');
//             wrapper.update();
//             expectPageMode(wrapper, PageMode.Selector);
//
//             expect(coreStartMock.http.post).not.toHaveBeenCalled();
//             expect(coreStartMock.notifications.toasts.addError).not.toHaveBeenCalled();
//         });
//     });
// });
