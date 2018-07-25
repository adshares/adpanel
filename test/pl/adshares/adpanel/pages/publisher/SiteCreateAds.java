package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.*;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import java.util.List;
import java.util.Random;
import java.util.Set;

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
    List<WebElement> od = driver.findElements(By.xpath("//*[@id='cdk-accordion-child-2']/div/div[3]//div[@class ='site-edit-create-ad-units__ad-unit ng-star-inserted']"));
    int random = (int) (Math.random() * (1) + (-3));
    Random rand = new Random();
    int randomProduct = rand.nextInt(od.size());
    od.get(randomProduct).click();
  }

  public void goToSummary() {
    wait.until(ExpectedConditions.visibilityOf(saveButtonPublisherCampaign));
    saveButtonPublisherCampaign.click();
    System.out.println("7. Create Ads - OK");
  }
  public void createAdUnitError() throws InterruptedException {
    wait.until(ExpectedConditions.visibilityOf(AssertionErrorMsgNgStarInserted));
    Assert.assertEquals("Name of Unit required!", AssertionNameOfUnitRequired.getText());
    System.out.println("8. Name of Unit required! - OK ");
  }
  public void back() throws InterruptedException {
    wait.until(ExpectedConditions.visibilityOf(back));
    back.click();
    Alert alert = driver.switchTo().alert();
    alert.accept();
    System.out.println("9. Back Create Ads - OK");
  }
}
