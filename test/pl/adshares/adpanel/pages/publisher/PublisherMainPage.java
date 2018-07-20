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

  public void goToAddNewSite_down() {
  wait.until(ExpectedConditions.visibilityOf(logoAssertion));
  Assert.assertTrue(logoAssertion.isDisplayed());
  wait.until(ExpectedConditions.visibilityOf(newAddSiteListBar));
  Assert.assertTrue(newAddSiteListBar.isEnabled());
  newAddSiteListBar.click();
  }

  public void goToEditSiteActive() {
    wait.until(ExpectedConditions.visibilityOf(logoAssertion));
    Assert.assertTrue(logoAssertion.isDisplayed());
    wait.until(ExpectedConditions.visibilityOf(editSiteListBar));
    Assert.assertTrue(editSiteListBar.isEnabled());
    editSiteListBar.click();
  }


}
