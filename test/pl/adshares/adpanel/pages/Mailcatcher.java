package pl.adshares.adpanel.pages;

import org.junit.Before;
import org.openqa.selenium.*;
import org.openqa.selenium.Keys;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class Mailcatcher {

  @FindBy(id = "messages")  private WebElement mailcatcherMessages;
  @FindBy(name = "search")  private WebElement search;
  @FindBy(id = "selected")  private WebElement selected;
  @FindBy(css = "[class='button button-blue']")  private WebElement button;
  @FindBy(css = "[data-message-id='1']")  private WebElement dataMessageId;
  @FindBy(css = "[class='clear']")  private WebElement clear;

  private WebDriver driver;
  private WebDriverWait wait;

  public Mailcatcher(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }

  @Test
  public void mailcatcherEmail() throws InterruptedException {
    System.out.println("---------- Mailcatcher ----------");
    driver.get("http://mailcatcher.ads/");
    System.out.println(driver.getCurrentUrl());
    PageFactory.initElements(driver, this);
    wait.until(ExpectedConditions.visibilityOf(mailcatcherMessages));
    Thread.sleep(4000);
    mailcatcherMessages.click();
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.ARROW_UP, Keys.ARROW_UP);
    Thread.sleep(1000);
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.ENTER);
//    Thread.sleep(5000);
    driver.close();
  }
}
