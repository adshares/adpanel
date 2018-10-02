package pl.adshares.adpanel.pages.advertiser;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Page for entering targeting filters (second stage of campaign editing).
 */
public class EditCampaignTargetingPage {

  /**
   * CSS selector for require container
   */
  private static final String CSS_REQUIRE_BOX = "*[data-test='advertiser-edit-campaign-additional-targeting-accordion'] *[data-test='advertiser-edit-campaign-additional-targeting-accordion-panel-required']";


  /**
   * CSS selector for exclude container
   */
  private static final String CSS_EXCLUDE_BOX = "*[data-test='advertiser-edit-campaign-additional-targeting-accordion'] *[data-test='advertiser-edit-campaign-additional-targeting-accordion-panel-excluded']";

  @FindBy(css = CSS_REQUIRE_BOX)
  private WebElement requireBox;
  @FindBy(css = CSS_EXCLUDE_BOX)
  private WebElement excludeBox;

  @FindBy(css = "[data-test='advertiser-edit-campaign-navigate-back']")
  private WebElement backButton;
  @FindBy(css = "[data-test='advertiser-edit-campaign-save-as-draft']")
  private WebElement saveAsDraftButton;
  @FindBy(css = "[data-test='advertiser-edit-campaign-save-and-continue']")
  private WebElement saveButton;


  private WebDriver driver;
  private WebDriverWait wait;

  public EditCampaignTargetingPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }

//  public void toggleRequireBox() {
//    wait.until(ExpectedConditions.visibilityOf(requireBox));
//    boolean isDisplayed = requireAvailOptionList.isDisplayed();
//    requireBox.findElement(By.cssSelector("mat-expansion-panel-header")).click();
//    if (isDisplayed) {
//      wait.until(ExpectedConditions.not(ExpectedConditions.visibilityOf(requireAvailOptionList)));
//    } else {
//      wait.until(ExpectedConditions.visibilityOf(requireAvailOptionList));
//    }
//  }
//
//  public void toggleExcludeBox() {
//    wait.until(ExpectedConditions.visibilityOf(excludeBox));
//    boolean isDisplayed = excludeAvailOptionList.isDisplayed();
//    excludeBox.findElement(By.cssSelector("mat-expansion-panel-header")).click();
//    if (isDisplayed) {
//      wait.until(ExpectedConditions.not(ExpectedConditions.visibilityOf(excludeAvailOptionList)));
//    } else {
//      wait.until(ExpectedConditions.visibilityOf(excludeAvailOptionList));
//    }
//  }

  /**
   * Unfolds require section
   */
  public void showRequireBox() {
    showBox(requireBox);
  }

  /**
   * Unfolds exclude section
   */
  public void showExcludeBox() {
    showBox(excludeBox);
  }

  /**
   * Unfolds page section
   *
   * @param box require/exclude section
   */
  private void showBox(WebElement box) {
    wait.until(ExpectedConditions.visibilityOf(box));
    WebElement availOptionList = box.findElement(By.cssSelector("div.mat-expansion-panel-content"));
    boolean isDisplayed = availOptionList.isDisplayed();
    if (!isDisplayed) {
      box.findElement(By.cssSelector("mat-expansion-panel-header")).click();
      wait.until(ExpectedConditions.visibilityOf(availOptionList));
    }
  }

  public void selectOption(TargetCategory category) {
    String[] s1 = new String[]{"Site", "Site domain", "coinmarketcap.com"};

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
      xpath = String.format(".//div[@data-test='common-targeting-select-option' and normalize-space(.)='%s']", s);
      opt = box.findElement(By.xpath(xpath));
      opt.click();
    }
    xpath = ".//*[@data-test='common-targeting-select-add-selected-options-button']";
    opt = box.findElement(By.xpath(xpath));
    opt.click();
  }

  //TODO waiting for frontend fix - visibility of category will be changed
  public void getSelectedOption() {
//    showRequireBox();
//    int size = requireSelectedOptionList.size();
//    for (WebElement we : requireSelectedOptionList) {
//      String text = we.findElement(By.tagName("p")).getText();
//    }
  }

  public void saveData() {
    wait.until(ExpectedConditions.visibilityOf(saveButton));
    saveButton.click();
  }

  public void saveDataAsDraft() {
    wait.until(ExpectedConditions.visibilityOf(saveAsDraftButton));
    saveAsDraftButton.click();
  }

  public void goBack() {
    wait.until(ExpectedConditions.visibilityOf(backButton));
    backButton.click();

    driver.switchTo().alert().accept();
  }

  public enum TargetCategory {
    REQUIRED,
    EXCLUDED
  }
}
