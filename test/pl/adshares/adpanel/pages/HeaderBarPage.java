package pl.adshares.adpanel.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pl.adshares.adpanel.tools.RandomPage;


public class HeaderBarPage {

  /**
   * Hover menu
   */
  @FindBy(css = "div[data-test='header-toggle-settings-menu']")
  private WebElement headerSettingsMenu;
  @FindBy(css = "span[data-test='header-log-out-button']")
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

  public HeaderBarPage logOut() {
    wait.until(ExpectedConditions.elementToBeClickable(headerSettingsMenu));
    Actions action = new Actions(driver);
    WebElement we = driver.findElement(By.cssSelector("div[data-test='header-toggle-settings-menu']"));
    action.moveToElement(we).moveToElement(driver.findElement(By.cssSelector("span[data-test='header-log-out-button']"))).click().build().perform();
    wait.until(ExpectedConditions.elementToBeClickable(logOut));
    logOut.click();
    int id = (int) RandomPage.getFromId("id");
    System.out.println(id+". Log Out - OK"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
    return PageFactory.initElements(driver, HeaderBarPage.class);
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
