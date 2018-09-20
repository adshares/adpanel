package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pl.adshares.adpanel.tools.Maps;


public class SiteSummary {

  @FindBy(css = "[data-test='publisher-edit-site-start-campaign']")  private WebElement publishSiteButton;
  @FindBy(css = "[data-test='publisher-site-url']")                  private WebElement basicInformationComparing;
  @FindBy(css = "[data-test='publisher-edit-site-navigate-back']")   private WebElement back;

  private WebDriver driver;
  private WebDriverWait wait;

  public SiteSummary(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 1000);
    PageFactory.initElements(driver, this);
  }

  public void summaryCheck() {
//    Assert.assertEquals(websiteUrl,basicInformationComparing);
  }

  public void publishNewSite() {
    wait.until(ExpectedConditions.visibilityOf(publishSiteButton));
    publishSiteButton.click();
    int id = (int) Maps.getId("id");
    System.out.println(id+". Summary - OK"); id=id+1;
    Maps.createId();
    Maps.id("id", id);
  }
  public void back() {
    wait.until(ExpectedConditions.visibilityOf(back));
    back.click();
    int id = (int) Maps.getId("id");
    System.out.println(id+". Back Summary - OK"); id=id+1;
    Maps.createId();
    Maps.id("id", id);
  }

}
