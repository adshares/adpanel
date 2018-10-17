package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

public class PublisherMainPage {
  /**
   * Publisher paths
   */
  @FindBy(css = "[data-test='header-create-new-asset-button']")
  private WebElement newAddSiteToolBar;
  @FindBy(css = "[data-test='publisher-create-new-site']")
  private WebElement newAddSiteListBar;
  @FindBy(css = "[data-test='publisher-site-status']")
  //@FindBy(css = "[data-test='data-status=active']")
  private WebElement editSiteListBar;


  /**
   * Dashboard Assertions
   */
  @FindBy(xpath = "//img[@src='assets/images/logo--white.png']")
  private WebElement logoAssertion;

  private WebDriver driver;
  private WebDriverWait wait;

  public PublisherMainPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 100);
    PageFactory.initElements(driver, this);
  }

  public void AddNewSite() {
    wait.until(ExpectedConditions.visibilityOf(logoAssertion));
    Assert.assertTrue(logoAssertion.isDisplayed());
    wait.until(ExpectedConditions.visibilityOf(newAddSiteToolBar));
    Assert.assertTrue(newAddSiteToolBar.isEnabled());
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    newAddSiteToolBar.click();
  }

  public void goToAddNewSite_down() {
  wait.until(ExpectedConditions.visibilityOf(logoAssertion));
  Assert.assertTrue(logoAssertion.isDisplayed());
  wait.until(ExpectedConditions.visibilityOf(newAddSiteListBar));
  Assert.assertTrue(newAddSiteListBar.isEnabled());
  newAddSiteListBar.click();
  }

  public void goToEditSiteActive() {
//    Thread.sleep(10000);
    wait.until(ExpectedConditions.visibilityOf(logoAssertion));
    Assert.assertTrue(logoAssertion.isDisplayed());
    wait.until(ExpectedConditions.visibilityOf(editSiteListBar));
    Assert.assertTrue(editSiteListBar.isEnabled());
    try {
      Thread.sleep(10000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    editSiteListBar.click();
  }


}
