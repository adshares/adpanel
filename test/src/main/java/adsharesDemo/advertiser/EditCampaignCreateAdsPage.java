package adsharesDemo.advertiser;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

/**
 * Page for entering targeting filters (second stage of campaign editing).
 */
public class EditCampaignCreateAdsPage {


  @FindBy(css = "section.campaign-edit-create-ads")
  private WebElement section;

  @FindBy(xpath = "//span[contains(text(), 'Create new Ad')]")
  private WebElement advButton;
  @FindBy(css = "body > div.cdk-overlay-container mat-option")
  private List<WebElement> advOptionList;

  private WebDriver driver;
  private WebDriverWait wait;

  public EditCampaignCreateAdsPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }

  public void addAdvertisement() {

    wait.until(ExpectedConditions.visibilityOf(advButton));
    advButton.click();

    // created ad is second element from the end
    int index = getSectionSize() - 2;
    String cssSelector = String.format("section > div:nth-child(%d) .mat-expansion-panel-body", index);
    WebElement advBody = section.findElement(By.cssSelector(cssSelector));

    WebElement advHeadline = advBody.findElement(By.id("shortHeadline"));
    advHeadline.sendKeys("Advertisement #1");
    List<WebElement> advSelectList = advBody.findElements(By.cssSelector("div.mat-select-trigger"));
    WebElement advTypeSelect = advSelectList.get(0);
    WebElement advSizeSelect = advSelectList.get(1);

//    String type = "image";
    String type = "html";
    advTypeSelect.click();
    wait.until(ExpectedConditions.visibilityOf(advOptionList.get(0)));
    for (WebElement we : advOptionList) {
      String optionText = we.findElement(By.tagName("span")).getText();
      if (type.equals(optionText)) {
        we.click();
        wait.until(ExpectedConditions.stalenessOf(advOptionList.get(0)));
        break;
      }
    }


    String size = "900x120";
    advSizeSelect.click();
    wait.until(ExpectedConditions.visibilityOf(advOptionList.get(0)));
    for (WebElement we : advOptionList) {
      String optionText = we.findElement(By.tagName("span")).getText();
      if (size.equals(optionText)) {
        we.click();
        wait.until(ExpectedConditions.stalenessOf(advOptionList.get(0)));
        break;
      }
    }

    if ("html".equals(type)) {
      // insert html
      WebElement htmlTextArea = advBody.findElement(By.tagName("textarea"));
      htmlTextArea.sendKeys("<div style=\"width:100px;height:50px;background-color:red;\" />");
      WebElement saveHtmlButton = advBody.findElement(By.xpath("//button[contains(text(), 'Save Html')]"));
      saveHtmlButton.click();
    } else {
      // upload image
      WebElement fileSelectInput = advBody.findElement(By.id("fileSelect"));
      String absPathToImage = "C:\\Users\\PawełPodkalicki\\Downloads\\testy\\t4_firefox_wartosc_portfela.png";
      fileSelectInput.sendKeys(absPathToImage);
    }


  }

  public void saveData() {
    int index = getSectionSize();
    String cssSelector = String.format("section > div:nth-child(%d) > div > button:nth-child(2)", index);
    WebElement saveButton = section.findElement(By.cssSelector(cssSelector));
    wait.until(ExpectedConditions.visibilityOf(saveButton));
    saveButton.click();
  }

  /**
   * @return number of containers in section object
   */
  private int getSectionSize() {
    wait.until(ExpectedConditions.visibilityOf(section));
    return section.findElements(By.cssSelector("section > div")).size();
  }

  public void saveDataAsDraft() {
    int index = getSectionSize();
    String cssSelector = String.format("section > div:nth-child(%d) > div > button:nth-child(1)", index);
    WebElement saveAsDraftButton = section.findElement(By.cssSelector(cssSelector));
    wait.until(ExpectedConditions.visibilityOf(saveAsDraftButton));
    saveAsDraftButton.click();
  }

  public void goBack() {
    int index = getSectionSize();
    String cssSelector = String.format("section > div:nth-child(%d) > a", index);
    WebElement backButton = section.findElement(By.cssSelector(cssSelector));
    wait.until(ExpectedConditions.visibilityOf(backButton));
    backButton.click();

    driver.switchTo().alert().accept();
  }
}
