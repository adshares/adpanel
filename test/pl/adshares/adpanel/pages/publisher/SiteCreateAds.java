package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.*;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import pl.adshares.adpanel.tools.Maps;

import java.util.Random;

public class SiteCreateAds {

  @FindBy(css = "[data-test='publisher-edit-site-create-ad-units-create-new-ad-unit']")                                 private WebElement createAdUnitDropDownButton;
  @FindBy(css = "[data-test='publisher-edit-site-summary-navigate-to-create-ad-units']")                                private WebElement editCreateAdUnits;
  @FindBy(css = "#shortHeadline")                                                                                       private WebElement nameOfUnit;
  @FindBy(css = "[data-test='publisher-edit-site-create-ad-units-form-ad-type-select']")                                private WebElement adTypeSelecetList;
  @FindBy(css = "[data-test='publisher-edit-site-create-ad-units-form-size-select']")                                   private WebElement sizeSelectList;

  @FindBy(xpath = "//mat-option[@data-test='publisher-edit-site-create-ad-units-form-ad-type-option']/span[contains(text(),'html')]") private WebElement adTypeHtml;
  @FindBy(xpath = "//mat-option[@data-test='publisher-edit-site-create-ad-units-form-ad-type-option']/span[contains(text(),'image')]") private WebElement adTypeImage;
  @FindBy(css = "[data-test='publisher-edit-site-save-and-continue']")                                                  private WebElement saveAndContinue;
  @FindBy(css = "[data-test='publisher-edit-site-save-as-draft']")                                                      private WebElement saveAsDraft;
  @FindBy(xpath = "//*[contains(text(),'Back')]")                                                                       private WebElement back;
  @FindBy(css = "[data-test='publisher-edit-site-create-ad-units-form-ad-unit-select']")                                private WebElement sizeOfUnit;
//  Assertion
  @FindBy(css = "[class='error-msg ng-star-inserted']")                                                                 private WebElement AssertionErrorMsgNgStarInserted;
  @FindBy(xpath = "//span[contains(text(), 'Name of Unit required!')]")                                                 private WebElement AssertionNameOfUnitRequired;
  @FindBy(xpath = "//*[contains(text(), '1. Requires')]")                                                               private WebElement AssertAdditionalTargeting1;
  @FindBy(xpath = "//*[contains(text(), '2. Excludes')]")                                                               private WebElement AssertAdditionalTargeting2;
  @FindBy(xpath = "//*[contains(text(), 'My Sites')]")                                                                  private WebElement AssertMySites;
  @FindBy(xpath = "//*[contains(text(), 'Summary')]")                                                                   private WebElement AssertSummary;
  @FindBy(xpath = "//*[contains(text(), 'Name of Unit required!')]")                                                    private WebElement AssertNameOfUnit;

  private WebDriver driver;
  private WebDriverWait wait;

  public SiteCreateAds(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }
  private void alert() {

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
    wait.until(ExpectedConditions.visibilityOf(nameOfUnit));
    nameOfUnit.sendKeys("Html");
    System.out.println("NameOfUni:      Html");
    wait.until(ExpectedConditions.visibilityOf(adTypeSelecetList));
    adTypeSelecetList.click();
    wait.until(ExpectedConditions.visibilityOf(adTypeHtml));
    adTypeHtml.click();
    System.out.println("Click - adTypeHtml");
    addSize();
  }

  public void adUnitImage() {
    System.out.println("---------- adUnitImage ----------");
    wait.until(ExpectedConditions.visibilityOf(nameOfUnit));
    nameOfUnit.sendKeys("Image");
    System.out.println("NameOfUni: Image");
    wait.until(ExpectedConditions.visibilityOf(adTypeSelecetList));
    adTypeSelecetList.click();
    wait.until(ExpectedConditions.visibilityOf(adTypeImage));
    adTypeImage.click();
    System.out.println("Click - adTypeImage");
    addSize();
  }

  @FindBy(xpath = "//*[@class='mat-select-content ng-trigger ng-trigger-fadeInContent']")                               private WebElement listShowing;
  @FindBy(xpath = "//*[@class='mat-expansion-panel-body']")                                                             private WebElement listSizeOfUnit;
  private void addSize() {
    String[] Showing_list = {"728x90","300x250","336x280","300x600","320x100","468x60","234x60","125x125","120x600","160x600","180x150","120x240","200x200","300x1050","250x250","320x50","970x90","970x250","750x100","750x200","750x300"};
    String s = (Showing_list[new Random().nextInt(Showing_list.length)]);
    System.out.println("Showing:   "+s);
    String showing;
    showing = String.format(".//*[contains(text(),'%s')]",s);

    wait.until(ExpectedConditions.visibilityOf(listSizeOfUnit));
    WebElement nameSizeOfUnit;
    nameSizeOfUnit = listSizeOfUnit.findElement(By.xpath(showing));
    nameSizeOfUnit.click();
    System.out.println("Click - nameSizeOfUnit "+s);

    wait.until(ExpectedConditions.visibilityOf(sizeSelectList));
    sizeSelectList.click();
    System.out.println("Click - sizeSelectList");

    wait.until(ExpectedConditions.visibilityOf(listShowing));
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e1) {
      e1.printStackTrace();
    }
    WebElement nameShowing;
    nameShowing = listShowing.findElement(By.xpath(showing));
    nameShowing.click();
    nameOfUnit.click();
    System.out.println("Click - nameShowing "+s);

    wait.until(ExpectedConditions.visibilityOf(sizeSelectList));
    sizeSelectList.click();
    System.out.println("Click - sizeSelectList");
    wait.until(ExpectedConditions.visibilityOf(listShowing));
    String s2 = (Showing_list[new Random().nextInt(Showing_list.length)]);
    showing = String.format(".//*[contains(text(),'%s')]",s2);
    nameShowing = listShowing.findElement(By.xpath(showing));
    nameShowing.click();
    nameOfUnit.click();
    System.out.println("Click - nameShowing "+s2);

    wait.until(ExpectedConditions.visibilityOf(sizeSelectList));
    sizeSelectList.click();
    System.out.println("Click - sizeSelectList");
    wait.until(ExpectedConditions.visibilityOf(listShowing));
    String s3 = "All";
    showing = String.format(".//*[contains(text(),'%s')]",s3);
    nameShowing = listShowing.findElement(By.xpath(showing));
    nameShowing.click();
    nameOfUnit.click();
    System.out.println("Click - nameShowing "+s3);
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
    alert();
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
