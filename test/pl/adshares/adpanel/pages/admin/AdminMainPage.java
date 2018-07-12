package pl.adshares.adpanel.pages.admin;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.log4testng.Logger;

public class AdminMainPage {

  private static final Logger LOGGER = Logger.getLogger(AdminMainPage.class);

  @FindBy(css = "button[data-test='header-admin-set-earning-dialog-open-button']")
  private WebElement headerSetEarningButton;
  @FindBy(css = "mat-slider[data-test='admin-earnings-slider']")
  private WebElement earningSlider;
  @FindBy(css = "input[data-test='admin-earnings-direct-input']")
  private WebElement earningDirectInput;
  @FindBy(css = "button[data-test='admin-earnings-save-button']")
  private WebElement setEarningButton;
  @FindBy(xpath = "//span[contains(text(),'Set your earnings')]")
  private WebElement popUpTitle;
  @FindBy(css = "img[class='adsh-logo']")
  private WebElement logoAdshares;

  private WebDriver driver;
  private WebDriverWait wait;

  public AdminMainPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }

  public void goToSetEarningPopUp() {
    wait.until(ExpectedConditions.visibilityOf(logoAdshares));
    headerSetEarningButton.click();
  }

  public void setHValue(WebElement slider, double value)
  {
    double minValue = Double.parseDouble(slider.getAttribute("min"));
    double maxValue = Double.parseDouble(slider.getAttribute("max"));
    int sliderH = slider.getSize().height;
    int sliderW = slider.getSize().width;
    System.out.println(sliderH);
    System.out.println(sliderW);
    Actions action = new Actions(driver);
    action.dragAndDrop(earningSlider,earningSlider).perform();
//    action.moveToElement(slider, (int) (value * sliderW / (maxValue - minValue)), sliderH / 2).click().build().perform();
  }

  public void setEarnings() {
    wait.until(ExpectedConditions.visibilityOf(popUpTitle));
    Actions action = new Actions(driver);
    setHValue(earningSlider, 65.47);
    setEarningButton.click();

  }

}
