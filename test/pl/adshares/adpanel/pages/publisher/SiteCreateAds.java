package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.*;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import pl.adshares.adpanel.tools.Maps;

import java.util.List;
import java.util.Random;

public class SiteCreateAds {

  @FindBy(css = "[data-test='publisher-edit-site-create-ad-units-create-new-ad-unit']")   private WebElement createAdUnitDropDownButton;
  @FindBy(css = "[data-test='publisher-edit-site-summary-navigate-to-create-ad-units']")  private WebElement editCreateAdUnits;
  @FindBy(css = "#shortHeadline")                                                         private WebElement nameOfUnit;
  @FindBy(css = "[data-test='publisher-edit-site-create-ad-units-form-ad-type-select']")  private WebElement adTypeSelecetList;
  @FindBy(xpath = "//mat-option[@data-test='publisher-edit-site-create-ad-units-form-ad-type-option']/span[contains(text(),'html')]") private WebElement adTypeHtml;
  @FindBy(css = "[data-test='publisher-edit-site-save-and-continue']")                    private WebElement saveButtonPublisherCampaign;
//  Assertion
  @FindBy(css = "[class='error-msg ng-star-inserted']")                                   private WebElement AssertionErrorMsgNgStarInserted;
  @FindBy(xpath = "//span[contains(text(), 'Name of Unit required!')]")                   private WebElement AssertionNameOfUnitRequired;
  @FindBy(css = "[data-test='publisher-edit-site-navigate-back']")                            private WebElement back;

  private WebDriver driver;
  private WebDriverWait wait;

  public SiteCreateAds(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 1000);
    PageFactory.initElements(driver, this);
  }

  public void createAdUnit() {
    wait.until(ExpectedConditions.visibilityOf(createAdUnitDropDownButton));
    createAdUnitDropDownButton.click();
  }

  public void editAdUnit() {
    wait.until(ExpectedConditions.visibilityOf(editCreateAdUnits));
    editCreateAdUnits.click();
  }

  public void adUnitTemplate(String NameOfUni) {
    wait.until(ExpectedConditions.visibilityOf(nameOfUnit));
    nameOfUnit.sendKeys(NameOfUni);
    adTypeSelecetList.click();
    adTypeHtml.click();
    List<WebElement> od = driver.findElements(By.xpath("//*[@id='cdk-accordion-child-2']/div/div[3]//div[@class ='site-edit-create-ad-uniTS _ad-unit ng-star-inserted']"));
    int random = (int) (Math.random() * (1) + (-3));
    Random rand = new Random();
    int randomProduct = rand.nextInt(od.size());
    od.get(randomProduct).click();
  }

  public void goToSummary() {
    wait.until(ExpectedConditions.visibilityOf(saveButtonPublisherCampaign));
    saveButtonPublisherCampaign.click();
    int id = (int) Maps.getId("id");
    System.out.println(id+". Create Ads - OK"); id=id+1;
    Maps.createId();
    Maps.id("id", id);
  }
  public void createAdUnitError() {
    wait.until(ExpectedConditions.visibilityOf(AssertionErrorMsgNgStarInserted));
    Assert.assertEquals("Name of Unit required!", AssertionNameOfUnitRequired.getText());
     int id = (int) Maps.getId("id");
    System.out.println(id+". Name of Unit required! - OK"); id=id+1;
    Maps.createId();
    Maps.id("id", id);
  }
  public void back() {
    wait.until(ExpectedConditions.visibilityOf(back));
    back.click();
    Alert alert = driver.switchTo().alert();
    alert.accept();
    int id = (int) Maps.getId("id");
    System.out.println(id+". Back Create Ads - OK"); id=id+1;
    Maps.createId();
    Maps.id("id", id);
  }
}
