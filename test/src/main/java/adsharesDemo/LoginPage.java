package adsharesDemo;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPage {

    @FindBy(id = "email")
    private WebElement loginEmail;
    @FindBy(id = "password")
    private WebElement loginPassword;
    @FindBy(css = "body > app-root > div > app-auth > section > div > div.col-xs-12.col-lg-6.adsh-auth__content.adsh-bg-white.ng-trigger.ng-trigger-fadeAnimation > app-login > div > div > form > button")
    private WebElement loginButton;

    private WebDriver driver;
    private WebDriverWait wait;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, 1000);
        PageFactory.initElements(driver, this);
    }

    public void loginSignIn(String login, String password) {
        loginEmail.sendKeys(login);
        loginPassword.sendKeys(password);
        loginButton.click();
    }

}
