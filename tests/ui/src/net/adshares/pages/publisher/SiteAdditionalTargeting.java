package net.adshares.pages.publisher;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import java.util.List;
import java.util.Random;

public class SiteAdditionalTargeting {

  @FindBy(css = "[data-test='publisher-edit-site-save-and-continue']")
  private WebElement saveButtonPublisherCampaign;

  @FindBy(css = "[data-test='publisher-edit-site-save-as-draft']")
  private WebElement backButtonPublisherCampaign;
  /**
   * Requires List
   */
  @FindBy(css = "div.targeting-select-wrapper")
  private WebElement publisherList;

  @FindBy(xpath = "//button[contains(text(), 'Add Selected')]")
  private WebElement addSelectedButton;

  @FindBy(xpath = "//div[@data-test='common-targeting-select-navigate-to-parent-button']/following-sibling::div[@class='ng-star-inserted']")
  private WebElement subTypes;

  private WebDriver driver;
  private WebDriverWait wait;

  public SiteAdditionalTargeting(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 1000);
    PageFactory.initElements(driver, this);
  }

  /**
   * default List index
   * 1st index = creative type
   * 2nd index = Language
   * 3rd index = Screen
   * 4th index = Js support
   */
  public void publisherRequiresCreativeType() {
    wait.until(ExpectedConditions.visibilityOf(publisherList));
    List<WebElement> pubList = publisherList.findElements(By.cssSelector("[data-test='common-targeting-select-option']"));
    WebElement creaviteType = pubList.get(0);
    creaviteType.click();
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

  public void publisherRequiresLanguage() {
    wait.until(ExpectedConditions.visibilityOf(publisherList));
    List<WebElement> pubList = publisherList.findElements(By.cssSelector("[data-test='common-targeting-select-option']"));
    WebElement requiresLanguage = pubList.get(1);
    requiresLanguage.click();
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

  public void goToCreateAds() {
    wait.until(ExpectedConditions.visibilityOf(saveButtonPublisherCampaign));
    saveButtonPublisherCampaign.click();
  }
}
