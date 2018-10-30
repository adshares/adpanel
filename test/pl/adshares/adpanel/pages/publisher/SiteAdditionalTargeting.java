package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import pl.adshares.adpanel.pages.advertiser.EditCampaignTargetingPage;

import java.util.List;
import java.util.Random;

public class SiteAdditionalTargeting {

  @FindBy(css = "[data-test='publisher-edit-site-save-and-continue']")  private WebElement saveButtonPublisherCampaign;
  @FindBy(css = "[data-test='publisher-edit-site-save-as-draft']")      private WebElement backButtonPublisherCampaign;
  @FindBy(css = "div.targeting-select-wrapper")                         private WebElement publisherList;
  @FindBy(xpath = "//button[contains(text(), 'Add Selected')]")         private WebElement addSelectedButton;
  @FindBy(xpath = "//div[@data-test='common-targeting-select-navigate-to-parent-button']/following-sibling::div[@class='ng-star-inserted']") private WebElement subTypes;
  @FindBy(css = "[data-test='publisher-edit-site-navigate-back']")      private WebElement back;
  @FindBy(css = "[data-test='publisher-edit-site-save-as-draft']")      private WebElement saveAsDraft;
  @FindBy(xpath = "//*[contains(text(), 'Create Ad Units')]")                                                           private WebElement AssertCreateAdUnits;
  @FindBy(xpath = "//*[contains(text(), '1. Requires')]")                                                               private WebElement AssertAdditionalTargeting1;
  @FindBy(xpath = "//*[contains(text(), '2. Excludes')]")                                                               private WebElement AssertAdditionalTargeting2;
  @FindBy(xpath = "//*[contains(text(), 'My Sites')]")                                                                  private WebElement AssertMySites;

  @FindBy(xpath = "//*[@data-test='publisher-edit-site-additional-targeting-accordion-panel-required']")  private WebElement requireBox;
  @FindBy(xpath = "//*[@data-test='publisher-edit-site-additional-targeting-accordion-panel-excluded']")  private WebElement excludeBox;

  private WebDriver driver;
  private WebDriverWait wait;

  public SiteAdditionalTargeting(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 500);
    PageFactory.initElements(driver, this);
  }

  private void showBox(WebElement box) {
    wait.until(ExpectedConditions.visibilityOf(box));
    WebElement availOptionList = box.findElement(By.cssSelector("div.mat-expansion-panel-content"));
    boolean isDisplayed = availOptionList.isDisplayed();
    if (!isDisplayed) {
      box.findElement(By.cssSelector("mat-expansion-panel-header")).click();
      wait.until(ExpectedConditions.visibilityOf(availOptionList));
    }
  }
  public void publisherRequiresCreativeType() {
    wait.until(ExpectedConditions.visibilityOf(publisherList));
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    List<WebElement> pubList = publisherList.findElements(By.cssSelector("[data-test='common-targeting-select-option']"));
    WebElement creaviteType = pubList.get(0);
    creaviteType.click();
    List<WebElement> od = publisherList.findElements(By.xpath("//div[@data-test='common-targeting-select-navigate-to-parent-button']/following-sibling::div[@class='ng-star-inserted']"));
    for (int i = 0; i < 4; i++) {
      int random = (int) (Math.random() * (1) + (-4));
      Random rand = new Random();
      int randomProduct = rand.nextInt(od.size());
      od.get(randomProduct).click();
      Assert.assertTrue(addSelectedButton.isEnabled());
    }
    addSelectedButton.click();
  }

  public void publisherRequiresLanguage() {
    wait.until(ExpectedConditions.visibilityOf(publisherList));
    List<WebElement> pubList = publisherList.findElements(By.cssSelector("[data-test='common-targeting-select-option']"));
    WebElement requiresLanguage = pubList.get(1);
    requiresLanguage.click();
    List<WebElement> od = publisherList.findElements(By.xpath("//div[@data-test='common-targeting-select-navigate-to-parent-button']/following-sibling::div[@class='ng-star-inserted']"));
    for (int i = 0; i < 3; i++) {
      int random = (int) (Math.random() * (1) + (-3));
      Random rand = new Random();
      int randomProduct = rand.nextInt(od.size());
      od.get(randomProduct).click();
      Assert.assertTrue(addSelectedButton.isEnabled());
    }
    addSelectedButton.click();
  }

  public void publisherRequiresScreen() {
    wait.until(ExpectedConditions.visibilityOf(publisherList));
    List<WebElement> pubList4 = publisherList.findElements(By.cssSelector("[data-test='common-targeting-select-option']"));
    WebElement requiresScreen4 = pubList4.get(2);
    requiresScreen4.click();
//    Height/Width
    wait.until(ExpectedConditions.visibilityOf(publisherList));
    List<WebElement> pubList3 = publisherList.findElements(By.cssSelector("[data-test='common-targeting-select-option-label']"));
    WebElement requiresScreen3 = pubList3.get(1);
    requiresScreen3.click();
    List<WebElement> od = publisherList.findElements(By.xpath("//div[@data-test='common-targeting-select-navigate-to-parent-button']/following-sibling::div[@class='ng-star-inserted']"));
    for (int i = 0; i < 2; i++) {
      int random = (int) (Math.random() * (1) + (-2));
      Random rand = new Random();
      int randomProduct = rand.nextInt(od.size());
            od.get(randomProduct).click();
      Assert.assertTrue(addSelectedButton.isEnabled());
    }
    addSelectedButton.click();
  }

  public void publisherRequiresJsSupport() {
    wait.until(ExpectedConditions.visibilityOf(publisherList));
    List<WebElement> pubList = publisherList.findElements(By.cssSelector("[data-test='common-targeting-select-option']"));
    WebElement requiresJsSupport = pubList.get(3);
    requiresJsSupport.click();
    List<WebElement> od = publisherList.findElements(By.xpath("//div[@data-test='common-targeting-select-navigate-to-parent-button']/following-sibling::div[@class='ng-star-inserted']"));
    for (int i = 0; i < 1; i++) {
      int random = (int) (Math.random() * (1) + (-1));
      Random rand = new Random();
      int randomProduct = rand.nextInt(od.size());
      od.get(randomProduct).click();
      Assert.assertTrue(addSelectedButton.isEnabled());
    }
    addSelectedButton.click();
  }
  public void additionalTargetingsaveSaveContinue() {
    System.out.println("---------- additionalTargetingsaveSaveContinue ----------");
    wait.until(ExpectedConditions.visibilityOf(saveButtonPublisherCampaign));
    saveButtonPublisherCampaign.click();
    wait.until(ExpectedConditions.visibilityOf(AssertCreateAdUnits));
    Assert.assertEquals("Create Ad Units", AssertCreateAdUnits.getText());
    System.out.println("Assert - "+AssertCreateAdUnits.getText());
  }
  public void additionalTargetingsaveSaveDraft() {
    System.out.println("---------- additionalTargetingsaveSaveDraft ----------");
    wait.until(ExpectedConditions.visibilityOf(saveAsDraft));
    saveAsDraft.click();
    wait.until(ExpectedConditions.visibilityOf(AssertMySites));
    Assert.assertEquals("My Sites", AssertMySites.getText());
    System.out.println("Assert - "+AssertMySites.getText());
  }

  public void additionalTargetingsaveBack() {
    System.out.println("---------- additionalTargetingsaveBack ----------");
    wait.until(ExpectedConditions.visibilityOf(back));
    back.click();
    Alert alert = driver.switchTo().alert();
    alert.accept();
    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting1));
    Assert.assertEquals("1. Requires", AssertAdditionalTargeting1.getText());
    System.out.println("Assert - "+AssertAdditionalTargeting1.getText());
    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting2));
    Assert.assertEquals("2. Excludes", AssertAdditionalTargeting2.getText());
    System.out.println("Assert - "+AssertAdditionalTargeting2.getText());
  }

  public void additionalTargetingAll(TargetCategory category, String target_1, String target_2) {
    String[] s1 = new String[]{target_1, target_2};
    WebElement box = null;
    switch (category) {
      case REQUIRED:
        box = requireBox;
        break;
      case EXCLUDED:
        box = excludeBox;
        break;
    }
    showBox(box);
    wait.until(ExpectedConditions.visibilityOf(box));
    String xpath;
    WebElement opt;
    for (String s : s1) {
      xpath = String.format(".//*[contains(text(), '%s')]", s);
      opt = box.findElement(By.xpath(xpath));
      wait.until(ExpectedConditions.visibilityOf(opt));
//      System.out.println("xpath: "+xpath);
      opt.click();
    }
    xpath = ".//*[contains(text(), 'Add Selected')]";
//    System.out.println("xpath: "+xpath);
    opt = box.findElement(By.xpath(xpath));
    wait.until(ExpectedConditions.visibilityOf(opt));
    opt.click();
  }
  public enum TargetCategory {
    REQUIRED,
    EXCLUDED
  }
}
