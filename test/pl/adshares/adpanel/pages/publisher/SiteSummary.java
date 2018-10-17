package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.Alert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import pl.adshares.adpanel.tools.RandomPage;


public class SiteSummary {

  @FindBy(css = "[data-test='publisher-edit-site-start-campaign']")  private WebElement publishSiteButton;
  @FindBy(css = "[data-test='publisher-site-url']")                  private WebElement basicInformationComparing;
  @FindBy(css = "[data-test='publisher-edit-site-navigate-back']")   private WebElement back;
  @FindBy(css = "[data-test='publisher-edit-site-save-as-draft']")                                                      private WebElement saveAsDraft;
  @FindBy(xpath = "//*[contains(text(), 'Create Ad Units')]")                                                           private WebElement AssertCreateAdUnits;
  @FindBy(xpath = "//*[contains(text(), 'My Sites')]")                                                                  private WebElement AssertMySites;
  @FindBy(xpath = "//*[contains(text(), '1. Basic Information')]")                                                      private WebElement AssertSummaty1;
  @FindBy(xpath = "//*[contains(text(), '2. Additional Targeting')]")                                                   private WebElement AssertSummaty2;
  @FindBy(xpath = "//*[contains(text(), '3. Ad Units')]")                                                               private WebElement AssertSummaty3;

  private WebDriver driver;
  private WebDriverWait wait;

  public SiteSummary(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 60);
    PageFactory.initElements(driver, this);
  }

  public void summaryPublishSite() {
    System.out.println("---------- summaryPublishSite ----------");
    wait.until(ExpectedConditions.visibilityOf(AssertSummaty1));
    Assert.assertEquals("1. Basic Information", AssertSummaty1.getText());
    System.out.println("Assert - "+AssertSummaty1.getText());
    wait.until(ExpectedConditions.visibilityOf(AssertSummaty2));
    Assert.assertEquals("2. Additional Targeting", AssertSummaty2.getText());
    System.out.println("Assert - "+AssertSummaty2.getText());
    wait.until(ExpectedConditions.visibilityOf(AssertSummaty3));
    Assert.assertEquals("3. Ad Units", AssertSummaty3.getText());
    System.out.println("Assert - "+AssertSummaty3.getText());
    wait.until(ExpectedConditions.visibilityOf(publishSiteButton));
    publishSiteButton.click();
  }
  public void summarySaveDraft() {
    System.out.println("---------- summarySaveDraft ----------");
    wait.until(ExpectedConditions.visibilityOf(saveAsDraft));
    saveAsDraft.click();
    wait.until(ExpectedConditions.visibilityOf(AssertMySites));
    Assert.assertEquals("My Sites", AssertMySites.getText());
    System.out.println("Assert - "+AssertMySites.getText());
  }
  public void summaryBack() {
    System.out.println("---------- summaryBack ----------");
    wait.until(ExpectedConditions.visibilityOf(back));
    back.click();
    wait.until(ExpectedConditions.visibilityOf(AssertCreateAdUnits));
    Assert.assertEquals("Create Ad Units", AssertCreateAdUnits.getText());
    System.out.println("Assert - "+AssertCreateAdUnits.getText());
  }
}
