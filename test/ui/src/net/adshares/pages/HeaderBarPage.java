package net.adshares.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class HeaderBarPage {

  @FindBy(xpath = "//div[@data-test='header-toggle-settings-menu']")
  private WebElement headerSettingsMenu;
  @FindBy(xpath = "//span[contains(text(), 'Log out')]")
  private WebElement logOut;
  @FindBy(css = "li[data-test='header-account-settings-button']")
  private WebElement accountSettingsButton;
  @FindBy(css = "li[data-test='header-billing-payments-button']")
  private WebElement billingPaymentsButton;

  private WebDriver driver;
  private WebDriverWait wait;

  public HeaderBarPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 20);
    PageFactory.initElements(driver, this);
  }

  public void logOut() {
    headerSettingsMenu.click();
    wait.until(ExpectedConditions.visibilityOf(logOut));
    logOut.click();
  }

  public void goToGeneralSettings() {
    headerSettingsMenu.click();
    wait.until(ExpectedConditions.visibilityOf(accountSettingsButton));
    accountSettingsButton.click();
  }

  public void goToBillingPayments() {
    headerSettingsMenu.click();
    wait.until(ExpectedConditions.visibilityOf(billingPaymentsButton));
    billingPaymentsButton.click();
  }


}
