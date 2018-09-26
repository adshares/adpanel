package pl.adshares.adpanel.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.Keys;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.log4testng.Logger;

import java.util.List;

import static org.openqa.selenium.WebElement.*;

public class Mailcatcher {
  private static final Logger LOGGER = Logger.getLogger(Mailcatcher.class);

  @FindBy(name = "search")
  private WebElement search;
  @FindBy(id = "messages")
  private WebElement messages;
  @FindBy(id = "selected")
  private WebElement selected;
  @FindBy(css = "[class='button button-blue']")
  private WebElement button;
  @FindBy(css = "[data-message-id='1']")
  private WebElement dataMessageId;
  @FindBy(css = "[class='clear']")
  private WebElement clear;

  private WebDriver driver;
  private WebDriverWait wait;

  public Mailcatcher(WebDriver driver) throws InterruptedException {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    ChromeOptions chromeOptions = new ChromeOptions();
    chromeOptions.addArguments("--start-maximized");
    driver = new ChromeDriver(chromeOptions);
    driver.get("http://mailcatcher.ads/");
    PageFactory.initElements(driver, this);
    //clear.click();
    //Thread.sleep(1000);
    //driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.ENTER);


    //wait.until(ExpectedConditions.visibilityOf(dataMessageId));
    //dataMessageId.click();
    wait.until(ExpectedConditions.visibilityOf(messages));
    messages.click();
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.ARROW_UP, Keys.ARROW_UP);
    Thread.sleep(5000);
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.ENTER);
    System.out.println("2. Mailcatcher - OK");
  }



  public void goToLoginRegistrRandom2() throws InterruptedException {
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    //Thread.sleep(12000);
  }



  }
