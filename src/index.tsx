import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { EuiContext } from '@elastic/eui';
import { ThemeProvider } from 'styled-components';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './containers/auth';
import * as euiVars from '@elastic/eui/dist/eui_theme_light.json';
import '@elastic/eui/dist/eui_theme_dark.css';

import 'moment/locale/ru';

moment.locale('ru');

const i18n = {
    mapping: {
        'euiSuperUpdateButton.refreshButtonLabel': 'Обновить',
        'euiSuperUpdateButton.updatingButtonLabel': 'Обновление...',
        'euiSuperUpdateButton.updateButtonLabel': 'Обновить',
        'euiSuperUpdateButton.cannotUpdateTooltip': 'Не удалось обновить',
        'euiSuperUpdateButton.clickToApplyTooltip': 'Нажмите для того чтобы применить',
        'euiSuperDatePicker.showDatesButtonLabel': 'Показать даты',
        'euiSelectable.placeholderName': 'Поиск',
        'euiSelectable.noAvailableOptions': 'Не удалось найти не одного элемента',
        'euiTablePagination.rowsPerPage': 'Кол-во строк на страницу',
        'euiTablePagination.rowsPerPageOption': '{rowsPerPage} строк'
    }
};

ReactDOM.render(
    <AuthProvider>
        <React.StrictMode>
            <EuiContext i18n={i18n}>
                <ThemeProvider theme={euiVars}>
                    <App />
                </ThemeProvider>
            </EuiContext>
        </React.StrictMode>
    </AuthProvider>,
    document.getElementById('root')
);

reportWebVitals();
