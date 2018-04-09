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
public class EditCampaignTargetingPage {
  /**
   * CSS selector for available option list
   */
  private static final String CSS_AVAILABLE_OPTION_LIST_SUFFIX = " app-targeting-select";
  /**
   * CSS selector for selected option list
   */
  private static final String CSS_SELECTED_OPTION_LIST_SUFFIX = " app-targeting-display > mat-chip-list > div.mat-chip-list-wrapper mat-chip";

  /**
   * CSS selector for require container
   */
  private static final String CSS_REQUIRE_BOX = "section.campaign-edit-additional-targeting > mat-accordion > div:nth-child(1) > mat-expansion-panel";
  /**
   * CSS selector for require row (element with list and selected options)
   */
  private static final String CSS_REQUIRE_ROW = CSS_REQUIRE_BOX + " > div.mat-expansion-panel-content > div > div.row";
  /**
   * CSS selector for require: available option list
   */
  private static final String CSS_REQUIRE_AVAILABLE_OPTION_LIST = CSS_REQUIRE_ROW + CSS_AVAILABLE_OPTION_LIST_SUFFIX;
  /**
   * CSS selector for require: selected option list
   */
  private static final String CSS_REQUIRE_SELECTED_OPTION_LIST = CSS_REQUIRE_ROW + CSS_SELECTED_OPTION_LIST_SUFFIX;

  /**
   * CSS selector for exclude container
   */
  private static final String CSS_EXCLUDE_BOX = "section.campaign-edit-additional-targeting > mat-accordion > div:nth-child(2) > mat-expansion-panel";
  /**
   * CSS selector for exclude row (element with list and selected options)
   */
  private static final String CSS_EXCLUDE_ROW = CSS_EXCLUDE_BOX + " > div.mat-expansion-panel-content > div > div.row";
  /**
   * CSS selector for exclude: available option list
   */
  private static final String CSS_EXCLUDE_AVAILABLE_OPTION_LIST = CSS_EXCLUDE_ROW + CSS_AVAILABLE_OPTION_LIST_SUFFIX;
  /**
   * CSS selector for exclude: selected option list
   */
  private static final String CSS_EXCLUDE_SELECTED_OPTION_LIST = CSS_EXCLUDE_ROW + CSS_SELECTED_OPTION_LIST_SUFFIX;


  @FindBy(css = CSS_REQUIRE_BOX)
  private WebElement requireBox;
  @FindBy(css = CSS_EXCLUDE_BOX)
  private WebElement excludeBox;
  @FindBy(css = CSS_REQUIRE_AVAILABLE_OPTION_LIST)
  private WebElement requireAvailOptionList;
  @FindBy(css = CSS_EXCLUDE_AVAILABLE_OPTION_LIST)
  private WebElement excludeAvailOptionList;
  @FindBy(css = CSS_REQUIRE_SELECTED_OPTION_LIST)
  private List<WebElement> requireSelectedOptionList;
  @FindBy(css = CSS_EXCLUDE_SELECTED_OPTION_LIST)
  private List<WebElement> excludeSelectedOptionList;

  @FindBy(css = "section.campaign-edit-additional-targeting > div > a")
  private WebElement backButton;
  @FindBy(css = "section.campaign-edit-additional-targeting > div > div > button:nth-child(1)")
  private WebElement saveAsDraftButton;
  @FindBy(css = "section.campaign-edit-additional-targeting > div > div > button:nth-child(2)")
  private WebElement saveButton;


  private WebDriver driver;
  private WebDriverWait wait;

  public EditCampaignTargetingPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }

  public void toggleRequireBox() {
    wait.until(ExpectedConditions.visibilityOf(requireBox));
    boolean isDisplayed = requireAvailOptionList.isDisplayed();
    requireBox.findElement(By.cssSelector("mat-expansion-panel-header")).click();
    if (isDisplayed) {
      wait.until(ExpectedConditions.not(ExpectedConditions.visibilityOf(requireAvailOptionList)));
    } else {
      wait.until(ExpectedConditions.visibilityOf(requireAvailOptionList));
    }
  }

  public void toggleExcludeBox() {
    wait.until(ExpectedConditions.visibilityOf(excludeBox));
    boolean isDisplayed = excludeAvailOptionList.isDisplayed();
    excludeBox.findElement(By.cssSelector("mat-expansion-panel-header")).click();
    if (isDisplayed) {
      wait.until(ExpectedConditions.not(ExpectedConditions.visibilityOf(excludeAvailOptionList)));
    } else {
      wait.until(ExpectedConditions.visibilityOf(excludeAvailOptionList));
    }
  }

  public void showRequireBox() {
    wait.until(ExpectedConditions.visibilityOf(requireBox));
    boolean isDisplayed = requireAvailOptionList.isDisplayed();
    if (!isDisplayed) {
      requireBox.findElement(By.cssSelector("mat-expansion-panel-header")).click();
      wait.until(ExpectedConditions.visibilityOf(requireAvailOptionList));
    }
  }

  public void showExcludeBox() {
    wait.until(ExpectedConditions.visibilityOf(excludeBox));
    boolean isDisplayed = excludeAvailOptionList.isDisplayed();
    if (!isDisplayed) {
      excludeBox.findElement(By.cssSelector("mat-expansion-panel-header")).click();
      wait.until(ExpectedConditions.visibilityOf(excludeAvailOptionList));
    }
  }

  public void selectOption(TargetCategory category) {
    String[] s1 = new String[]{"Site", "Site domain", "coinmarketcap.com"};

    WebElement box = null;
    switch (category) {
      case REQUIRED:
        showRequireBox();
        box = requireBox;
        break;
      case EXCLUDED:
        showExcludeBox();
        box = excludeBox;
        break;
    }

    wait.until(ExpectedConditions.visibilityOf(box));

    String xpath;
    WebElement opt;
    for (String s : s1) {
      xpath = String.format(".//span[contains(text(), '%s')]", s);
      opt = box.findElement(By.xpath(xpath));
      opt.click();
    }
    xpath = ".//button[contains(text(), 'Add Selected')]";
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
