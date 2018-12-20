package pl.adshares.adpanel.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

public class HeaderBarPage {
  @FindBy(css = "[data-test='header-log-out-button']")                                                                  private WebElement logOut;
  @FindBy(css = "li[data-test='header-account-settings-button']")                                                       private WebElement accountSettingsButton;
  @FindBy(css = "li[data-test='header-billing-payments-button']")                                                       private WebElement billingPaymentsButton;
  @FindBy(css = "[data-test='header-toggle-settings-menu']")                                                            private WebElement SettingsMenu;
  @FindBy(xpath = "//*[@class='adsh-icon adsh-icon--small adsh-icon--append settings-menu-chevron']")                   private WebElement SettingsMenuChevron;
  @FindBy(css = "[data-test='header-log-out-button']")                                                                  private WebElement SettingsLogOut;
  @FindBy(xpath = "//*[@data-test='header-active-user-type']")                                                          private WebElement activeUserType;
  @FindBy(xpath = "//*[@class='adsh-icon adsh-icon--small adsh-icon--append choose-user-menu-chevron ng-star-inserted']") private WebElement chooseUserMenuChevron;
  @FindBy(css = "[data-test='header-choose-user-menu-publisher']")                                                      private WebElement userMenuPublisher;
  @FindBy(css = "[data-test='header-choose-user-menu-advertiser']")                                                     private WebElement userMenuAdvertiser;

  private WebDriver driver;
  private WebDriverWait wait;

  public HeaderBarPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }

  public void logOut() {
    wait.until(ExpectedConditions.elementToBeClickable(SettingsMenuChevron));
    SettingsMenuChevron.click();
    wait.until(ExpectedConditions.elementToBeClickable(SettingsLogOut));
    SettingsLogOut.click();
    System.out.println("Click - SettingsLogOut");
    alert();
  }
  private void alert() {
    System.out.println("---------- alert ----------");
    int i=0;
    while (i++<5) {
      try {
        Alert alert = driver.switchTo().alert();
        System.out.println("Alert - " + alert.getText());
        alert.accept();
      } catch (NoAlertPresentException e) {
        try {
          Thread.sleep(1000);
        } catch (InterruptedException e1) {
          e1.printStackTrace();
        }
//        continue;
      }
    }
  }

  public void goToGeneralSettings() {
    SettingsMenu.click();
    wait.until(ExpectedConditions.visibilityOf(accountSettingsButton));
    accountSettingsButton.click();
  }

  public void goToBillingPayments() {
    SettingsMenu.click();
    wait.until(ExpectedConditions.visibilityOf(billingPaymentsButton));
    billingPaymentsButton.click();
  }

  public void changeOfRole() {
    System.out.println("---------- changeOfRole ----------");
    wait.until(ExpectedConditions.visibilityOf(activeUserType));
    System.out.println("activeUserType:  "+activeUserType.getText());
    wait.until(ExpectedConditions.visibilityOf(chooseUserMenuChevron));
    chooseUserMenuChevron.click();
    switch (activeUserType.getText()) {
      case "ADVERTISER":
        System.out.println("ADVERTISER >>>>> PUBLISHER");
        userMenuPublisher.click();
        wait.until(ExpectedConditions.visibilityOf(activeUserType));
        Assert.assertEquals("PUBLISHER", activeUserType.getText());
        System.out.println("activeUserType:  "+activeUserType.getText());
        break;
      case "PUBLISHER":
        System.out.println("PUBLISHER >>>>> ADVERTISER");
        userMenuAdvertiser.click();
        wait.until(ExpectedConditions.visibilityOf(activeUserType));
        Assert.assertEquals("ADVERTISER", activeUserType.getText());
        System.out.println("activeUserType:  "+activeUserType.getText());
        break;
    }

  }
}
