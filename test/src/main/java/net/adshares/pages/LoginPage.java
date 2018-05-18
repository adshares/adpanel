package net.adshares.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.log4testng.Logger;

public class LoginPage {
    private static final Logger LOGGER = Logger.getLogger(LoginPage.class);

    @FindBy(id = "email")
    private WebElement loginEmail;
    @FindBy(id = "password")
    private WebElement loginPassword;
    @FindBy(css = "body > app-root > div > app-auth > section > div > div.col-xs-12.col-lg-6.adsh-auth__content.adsh-bg-white.ng-trigger.ng-trigger-fadeAnimation > app-login > div > div > form > button")
    private WebElement loginButton;

    /**
     * Login Page - WebElement Assertions
     */
    @FindBy(xpath = "//img[@class = 'adsh-logo']")
    private WebElement assertLogo;
    @FindBy(xpath = "//*[contains(text(), 'Hello!')]")
    private WebElement helloText;

    private WebDriver driver;
    private WebDriverWait wait;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, 10);
        PageFactory.initElements(driver, this);
    }

    public void loginSignIn(String loginAdService, String passwordAdService) {
        wait.until(ExpectedConditions.titleIs(driver.getTitle()));
        Assert.assertTrue(helloText.isDisplayed());
        Assert.assertEquals(helloText.getText(), "Hello!");
        LOGGER.info("HeadTitle visibility: ok");
        Assert.assertTrue(assertLogo.isDisplayed());
        LOGGER.info("Logo visibility: ok");
        loginEmail.sendKeys(loginAdService);
        loginPassword.sendKeys(passwordAdService);
        Assert.assertTrue(loginButton.isEnabled());
        LOGGER.info("Button visibility: ok");
        loginButton.click();
    }

}
