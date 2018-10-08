package pl.adshares.adpanel.pages;

import pl.adshares.adpanel.tools.Maps;
import org.openqa.selenium.*;
import org.openqa.selenium.Keys;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.Test;

public class Mailcatcher {

//  Mailcatcher
  @FindBy(id = "messages")  private WebElement mailcatcherMessages;
  @FindBy(name = "search")  private WebElement search;
  @FindBy(id = "selected")  private WebElement selected;
  @FindBy(css = "[class='button button-blue']")  private WebElement button;
  @FindBy(css = "[data-message-id='1']")  private WebElement dataMessageId;
  @FindBy(css = "[class='clear']")  private WebElement clear;
//  MailHog
  @FindBy(css = "[class='msglist-message row ng-scope']")  private WebElement mailHogMessages;
  @FindBy(css = "[class='button button-blue']")  private WebElement mailHogAccept;
  @FindBy(xpath = "//*[@class='col-md-10']//tr[2]//td")  private WebElement mailHogSubject;
  @FindBy(xpath = "//*[@class='col-md-10']//tr[3]//td")  private WebElement mailHogTo;
  @FindBy(id = "preview-html")   private WebElement mailHogHtml;



  private WebDriver driver;
  private WebDriverWait wait;

  public Mailcatcher(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }

//  @Test
//  public void mailcatcherEmail() throws InterruptedException {
//    System.out.println("---------- Mailcatcher ----------");
//    driver.get(Maps.get_url_mailcatcher("url_mailcatcher"));
//    System.out.println(driver.getCurrentUrl());
//    PageFactory.initElements(driver, this);
//    wait.until(ExpectedConditions.visibilityOf(mailcatcherMessages));
//    Thread.sleep(4000);
//    mailcatcherMessages.click();
//    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.ARROW_UP, Keys.ARROW_UP);
//    Thread.sleep(1000);
//    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.ENTER);
//    driver.close();
//  }

//  Mailcatcher>>MailHog
  @Test
  public void mailcatcherEmail() {
    System.out.println("---------- MailHog ----------");
    try {
      Thread.sleep(4000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    driver.get(Maps.get_url_mailhog("url_mailhog"));
    System.out.println(driver.getCurrentUrl());
    PageFactory.initElements(driver, this);
//
//    String email=Maps.getEmail("email");
//    wait.until(ExpectedConditions.v(email);


    wait.until(ExpectedConditions.visibilityOf(mailHogMessages));
    mailHogMessages.click();
    System.out.println("To:      "+mailHogTo.getText());
    System.out.println("Subject: "+mailHogSubject.getText());
    driver.findElement(By.id("preview-html")).sendKeys(Keys.TAB, Keys.TAB, Keys.ENTER);
    driver.close();
  }
}
