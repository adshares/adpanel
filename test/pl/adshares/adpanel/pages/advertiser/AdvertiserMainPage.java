package pl.adshares.adpanel.pages.advertiser;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AdvertiserMainPage {

  /**
   * Button creating new campaign on top bar
   */
  @FindBy(css = "[data-test='header-create-new-asset-button']")
  private WebElement createNewCampaignTopButton;

  private WebDriver driver;
  private WebDriverWait wait;

  public AdvertiserMainPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }

  public void createNewCampaign() {
    wait.until(ExpectedConditions.visibilityOf(createNewCampaignTopButton));
    createNewCampaignTopButton.click();
  }


}
