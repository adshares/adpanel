package net.adshares.pages.publisher;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

public class PublisherMainPage {

    @FindBy(css = "#mat-dialog-0 > app-account-choose-dialog > mat-dialog-content > h6")
    private WebElement userPopUp;
    @FindBy(xpath = "//mat-dialog-content[@class = 'mat-dialog-content']/div[2]/button")
    private WebElement userPopUpPublisher;
    @FindBy(xpath = "//mat-dialog-content[@class = 'mat-dialog-content']/div[1]/button")
    private WebElement userPopUpAdvertiser;
    /**
     * Publisher paths
     */
    @FindBy(xpath = "//span[contains(text(), 'Add new Site')]")
    private WebElement newAddSiteToolBar;
    @FindBy(xpath = "//div[@class='adsh-box']//button//span[contains(text(), 'Add new site')]")
    private WebElement newAddSiteListBar;
    /**
     * Dashboard Assertions
     */
    @FindBy(xpath = "//img[@src='assets/images/logo--white.png']")
    private WebElement logoAssertion;

    private WebDriver driver;
    private WebDriverWait wait;

    public PublisherMainPage(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, 20);
        PageFactory.initElements(driver, this);
    }

    public void goToAddNewSite() {
        wait.until(ExpectedConditions.visibilityOf(logoAssertion));
        Assert.assertTrue(logoAssertion.isDisplayed());
        wait.until(ExpectedConditions.visibilityOf(newAddSiteToolBar));
        Assert.assertTrue(newAddSiteToolBar.isEnabled());
        newAddSiteToolBar.click();
    }
}
