package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.*;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import pl.adshares.adpanel.tools.Maps;

public class SiteCreateAds {

  @FindBy(css = "[data-test='publisher-edit-site-create-ad-units-create-new-ad-unit']")   private WebElement createAdUnitDropDownButton;
  @FindBy(css = "[data-test='publisher-edit-site-summary-navigate-to-create-ad-units']")  private WebElement editCreateAdUnits;
  @FindBy(css = "#shortHeadline")                                                         private WebElement nameOfUnit;
  @FindBy(css = "[data-test='publisher-edit-site-create-ad-units-form-ad-type-select']")  private WebElement adTypeSelecetList;
  @FindBy(xpath = "//mat-option[@data-test='publisher-edit-site-create-ad-units-form-ad-type-option']/span[contains(text(),'html')]") private WebElement adTypeHtml;
  @FindBy(xpath = "//mat-option[@data-test='publisher-edit-site-create-ad-units-form-ad-type-option']/span[contains(text(),'image')]") private WebElement adTypeImage;
  @FindBy(css = "[data-test='publisher-edit-site-save-and-continue']")                    private WebElement saveAndContinue;
  @FindBy(css = "[data-test='publisher-edit-site-save-as-draft']")                        private WebElement saveAsDraft;
  @FindBy(css = "[data-test='publisher-edit-site-navigate-back']")                        private WebElement back;
  @FindBy(css = "[data-test='publisher-edit-site-create-ad-units-form-ad-unit-select']")    private WebElement sizeOfUnit;
//  Assertion
  @FindBy(css = "[class='error-msg ng-star-inserted']")                                   private WebElement AssertionErrorMsgNgStarInserted;
  @FindBy(xpath = "//span[contains(text(), 'Name of Unit required!')]")                   private WebElement AssertionNameOfUnitRequired;
  @FindBy(xpath = "//*[contains(text(), '1. Requires')]")                                                               private WebElement AssertAdditionalTargeting1;
  @FindBy(xpath = "//*[contains(text(), '2. Excludes')]")                                                               private WebElement AssertAdditionalTargeting2;
  @FindBy(xpath = "//*[contains(text(), 'My Sites')]")                                                                  private WebElement AssertMySites;
  @FindBy(xpath = "//*[contains(text(), 'Summary')]")                                                                   private WebElement AssertSummary;
  @FindBy(xpath = "//*[contains(text(), 'Name of Unit required!')]")                                                    private WebElement AssertNameOfUnit;
  private WebDriver driver;
  private WebDriverWait wait;

  public SiteCreateAds(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 60);
    PageFactory.initElements(driver, this);
  }

  public void createNewAdUnit() {
    System.out.println("---------- createNewAdUnit ----------");
    wait.until(ExpectedConditions.visibilityOf(createAdUnitDropDownButton));
    createAdUnitDropDownButton.click();
    System.out.println("Click - createAdUnitDropDownButton");
  }
  public void editAdUnit() {
    System.out.println("---------- editAdUnit ----------");
    wait.until(ExpectedConditions.visibilityOf(editCreateAdUnits));
    editCreateAdUnits.click();
  }
  public void adUnitHtml() {
    System.out.println("---------- adUnitHtml ----------");
    System.out.println("campaign_name: "+Maps.get_campaign_name("campaign_name"));
    if (Maps.get_campaign_name("campaign_name") == null) {
      String name = "brak campaign";
      Maps.createBasicInformation();
      Maps.campaign_name("campaign_name",name);
    }
    wait.until(ExpectedConditions.visibilityOf(nameOfUnit));
    nameOfUnit.sendKeys(Maps.get_campaign_name("campaign_name"));
    System.out.println("NameOfUni:      "+Maps.get_campaign_name("campaign_name"));
    adTypeSelecetList.click();
    adTypeHtml.click();
  }
  public void adUnitImage() {
    System.out.println("---------- adUnitImage ----------");
    System.out.println("campaign_name: "+Maps.get_campaign_name("campaign_name"));
    if (Maps.get_campaign_name("campaign_name") == null) {
      String name = "brak campaign";
      Maps.createBasicInformation();
      Maps.campaign_name("campaign_name",name);
    }
    wait.until(ExpectedConditions.visibilityOf(nameOfUnit));
    nameOfUnit.sendKeys(Maps.get_campaign_name("campaign_name"));
    System.out.println("NameOfUni:      "+Maps.get_campaign_name("campaign_name"));
    adTypeSelecetList.click();
    adTypeImage.click();
  }
  public void createAdUnitError() {
    wait.until(ExpectedConditions.visibilityOf(AssertionErrorMsgNgStarInserted));
    Assert.assertEquals("Name of Unit required!", AssertionNameOfUnitRequired.getText());
    System.out.println("Assert - Name of Unit required!");
  }

  public void createAdUnitsSaveContinue() {
    System.out.println("---------- createAdUnitsSaveContinue ----------");
    wait.until(ExpectedConditions.visibilityOf(saveAndContinue));
    saveAndContinue.click();
    System.out.println("Click - saveAndContinue");
    wait.until(ExpectedConditions.visibilityOf(AssertSummary));
    Assert.assertEquals("Summary", AssertSummary.getText());
    System.out.println("Assert - "+AssertSummary.getText());
  }
  public void createAdUnitsSaveAsDraft() {
    System.out.println("---------- createAdUnitsSaveAsDraft ----------");
    wait.until(ExpectedConditions.visibilityOf(saveAsDraft));
    saveAsDraft.click();
    System.out.println("Click - saveAsDraft");
    wait.until(ExpectedConditions.visibilityOf(AssertMySites));
    Assert.assertEquals("My Sites", AssertMySites.getText());
    System.out.println("Assert - "+AssertMySites.getText());
  }
  public void createAdUnitsBack() {
    System.out.println("---------- createAdUnitsBack ----------");
    wait.until(ExpectedConditions.visibilityOf(back));
    back.click();
    Alert alert = driver.switchTo().alert();
    alert.accept();
    System.out.println("Click - back");
    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting1));
    Assert.assertEquals("1. Requires", AssertAdditionalTargeting1.getText());
    System.out.println("Assert - "+AssertAdditionalTargeting1.getText());
    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting2));
    Assert.assertEquals("2. Excludes", AssertAdditionalTargeting2.getText());
    System.out.println("Assert - "+AssertAdditionalTargeting2.getText());
  }

  public void createAdUnitsError(String name_of_unit) {
    System.out.println("---------- createAdUnitsError ----------");
    wait.until(ExpectedConditions.visibilityOf(createAdUnitDropDownButton));
    createAdUnitDropDownButton.click();
    System.out.println("Click - createAdUnitDropDownButton");
    wait.until(ExpectedConditions.visibilityOf(nameOfUnit));
    nameOfUnit.sendKeys(name_of_unit);
    wait.until(ExpectedConditions.visibilityOf(saveAndContinue));
    saveAndContinue.click();
    Assert.assertEquals("Name of Unit required!", AssertNameOfUnit.getText());
    System.out.println("Assert - "+AssertNameOfUnit.getText());
  }
}
