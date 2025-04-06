export class AuthPage {
    constructor(page) {
        this.page = page;
        this.emailField = page.getByRole('textbox', { name: 'Email' });
        this.passwordField = page.getByRole('textbox', { name: 'Password' });
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
    }

    async login(email, password) {
        await this.page.goto('https://user.asians.group/auth/realms/asians/protocol/openid-connect/auth?client_id=public&redirect_uri=https%3A%2F%2Fconsole.asians.group%2F%23%2F&state=625a8e65-456b-414a-8fa1-0db99c3dcbe3&response_mode=fragment&response_type=code&scope=openid&nonce=c0e2d0c0-4788-4f4f-8007-220821189d7a');
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.signInButton.click();
        await this.page.waitForTimeout(65000);
    }
}