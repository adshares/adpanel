package pl.adshares.adpanel.pages.admin;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
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

  @FindBy(xpath = "//button[contains(text(),'today')]")
  private WebElement buttonToday;
  @FindBy(xpath = "//button[contains(text(),'this week')]")
  private WebElement buttonThisWeek;
  @FindBy(xpath = "//button[contains(text(),'this month')]")
  private WebElement buttonThisMonth;


  @FindBy(css = "[data-test='chart-filter-by-type-asset-series-select']")
  private WebElement select;

  @FindBy(css = "[ng-reflect-value='saldo']")
  private WebElement selectSaldo;
  @FindBy(css = "[ng-reflect-value='views']")
  private WebElement selectViews;
  @FindBy(css = "[ng-reflect-value='clicks']")
  private WebElement selectClicks;

  @FindBy(css = "[id='mat-input-0']")
  private WebElement calender;
  @FindBy(css = "[class='mat-calendar-period-button mat-button']")
  private WebElement calenderUp;
  @FindBy(xpath = "//div[contains(text(),'2018')]")
  private WebElement calender2018;
  @FindBy(xpath = "//div[contains(text(),'JAN')]")
  private WebElement calenderJAN;
  @FindBy(xpath = "//div[contains(text(),'1')]")
  private WebElement calender1;

  private WebDriver driver;
  private WebDriverWait wait;

  public AdminMainPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 20);
    PageFactory.initElements(driver, this);
  }

  public void goToSetEarningPopUp()  {
    wait.until(ExpectedConditions.visibilityOf(logoAdshares));
    wait.until(ExpectedConditions.visibilityOf(headerSetEarningButton));
    headerSetEarningButton.click();
  }

  private void setHValue(WebElement slider, double value)
  {
    double minValue = Double.parseDouble(slider.getAttribute("min"));
    double maxValue = Double.parseDouble(slider.getAttribute("max"));
    int sliderH = slider.getSize().height;
    int sliderW = slider.getSize().width;
    System.out.println("2.1. sliderH: "+sliderH);
    System.out.println("2.2. sliderW: "+sliderW);
    Actions action = new Actions(driver);
    action.dragAndDrop(earningSlider,earningSlider).perform();
//    action.moveToElement(slider, (int) (value * sliderW / (maxValue - minValue)), sliderH / 2).click().build().perform();
  }

  public void setEarnings() {
        wait.until(ExpectedConditions.visibilityOf(popUpTitle));
    Actions action = new Actions(driver);
    setHValue(earningSlider, 65.47);
    setEarningButton.click();
    // TODO: 18.07.18 SAVE - nie działa [logo click - sprawdzenie]
    wait.until(ExpectedConditions.visibilityOf(logoAdshares));
    logoAdshares.click();
    System.out.println("3. Koniec testu");
  }


  public void setFilter()  {
    wait.until(ExpectedConditions.visibilityOf(buttonToday));
//    selectClicks
    select.click();
    selectClicks.click();
    buttonToday.click();
    buttonThisWeek.click();
    buttonThisMonth.click();
    calender.click();
    calenderUp.click();
    calender2018.click();
    calenderJAN.click();
    calender1.click();
    System.out.println("2. selectClicks - buttonToday, buttonThisWeek, buttonThisMonth, 1/1/2018");
//    selectSaldo
    select.click();
    selectSaldo.click();
    buttonToday.click();
    buttonThisWeek.click();
    buttonThisMonth.click();
    calender.click();
    calenderUp.click();
    calender2018.click();
    calenderJAN.click();
    calender1.click();
    System.out.println("3. selectSaldo - buttonToday, buttonThisWeek, buttonThisMonth, 1/1/2018");
//    selectViews
    select.click();
    selectViews.click();
    buttonToday.click();
    buttonThisWeek.click();
    buttonThisMonth.click();
    calender.click();
    calenderUp.click();
    calender2018.click();
    calenderJAN.click();
    calender1.click();
    System.out.println("4. selectViews - buttonToday, buttonThisWeek, buttonThisMonth, 1/1/2018");

    System.out.print("6. Koniec testu");
  }
}
