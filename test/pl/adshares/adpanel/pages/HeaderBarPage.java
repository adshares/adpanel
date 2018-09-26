package pl.adshares.adpanel.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class HeaderBarPage {

  @FindBy(css = "div[data-test='header-toggle-settings-menu']")                                                         private WebElement SettingsMenu;
  @FindBy(css = "span[data-test='header-log-out-button']")                                                              private WebElement SettingsMenu_LogOut;
  @FindBy(css = "li[data-test='header-account-settings-button']")                                                       private WebElement SettingsMenu_Account;
  @FindBy(css = "li[data-test='header-billing-payments-button']")                                                       private WebElement SettingsMenu_BillingPayments;
  @FindBy(css = "//*[@class='adsh-dialog-close']")                                                                      private WebElement adshDialogClose;

  private WebDriver driver;
  private WebDriverWait wait;

  public HeaderBarPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }

  public HeaderBarPage logOut() {
    System.out.println("---------- Log Out ----------");
    wait.until(ExpectedConditions.elementToBeClickable(SettingsMenu));
    JavascriptExecutor js =(JavascriptExecutor)driver;
    js.executeScript("arguments[0].click();", SettingsMenu);
    JavascriptExecutor js2 =(JavascriptExecutor)driver;
    js2.executeScript("arguments[0].click();", SettingsMenu_LogOut);
//    wait.until(ExpectedConditions.elementToBeClickable(SettingsMenu));
//    Actions action = new Actions(driver);
//    WebElement LogOut = driver.findElement(By.cssSelector("div[data-test='header-toggle-settings-menu']"));
//    wait.until(ExpectedConditions.elementToBeClickable(LogOut));
//    action.moveToElement(LogOut).moveToElement(driver.findElement(By.cssSelector("span[data-test='header-log-out-button']"))).click().build().perform();

//    driver.close();
//    if(!driver.findElements(By.xpath("//*[@class='adsh-dialog-close']")).isEmpty()){
//      System.out.println("Skip >>>>> Log Out");
//      }else{
//      wait.until(ExpectedConditions.elementToBeClickable(adshDialogClose));
//      adshDialogClose.click();
//      System.out.println("Click - Log Out");
//    }
    return PageFactory.initElements(driver, HeaderBarPage.class);
  }
}
