interface LoginValidatorOptions {
    shouldValidate?: boolean;
}

export interface LoginValidationResult {
    isInvalid: boolean;
    error?: string;
}

export class LoginValidator {
    private shouldValidate?: boolean;

    constructor(options: LoginValidatorOptions = {}) {
        this.shouldValidate = options.shouldValidate;
    }

    public enableValidation() {
        this.shouldValidate = true;
    }

    public disableValidation() {
        this.shouldValidate = false;
    }

    public validateUsername(username: string): LoginValidationResult {
        if (!this.shouldValidate) {
            return valid();
        }

        if (!username) {
            return invalid('Требуется логин');
        }

        return valid();
    }

    public validatePassword(password: string): LoginValidationResult {
        if (!this.shouldValidate) {
            return valid();
        }

        if (!password) {
            return invalid('Требуется пароль');
        }
        return valid();
    }

    public validateForLogin(username: string, password: string): LoginValidationResult {
        const { isInvalid: isUsernameInvalid } = this.validateUsername(username);
        const { isInvalid: isPasswordInvalid } = this.validatePassword(password);

        if (isUsernameInvalid || isPasswordInvalid) {
            return invalid();
        }

        return valid();
    }
}

function invalid(error?: string): LoginValidationResult {
    return {
        isInvalid: true,
        error,
    };
}

function valid(): LoginValidationResult {
    return {
        isInvalid: false,
    };
}