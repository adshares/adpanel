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
import pl.adshares.adpanel.pages.advertiser.EditCampaignTargetingPage;
import pl.adshares.adpanel.tools.RandomPage;

public class AdminMainPage {

  private static final Logger LOGGER = Logger.getLogger(AdminMainPage.class);

  @FindBy(id = "newPassword")                                                                                           private WebElement loginNewPassword;
  @FindBy(id = "currentPassword")                                                                                       private WebElement loginCurrentPassword;
  @FindBy(id = "newPasswordConfirm")                                                                                    private WebElement loginConfirmPassword;

  @FindBy(css = "button[data-test='header-admin-set-earning-dialog-open-button']")                                      private WebElement headerSetEarningButton;
  @FindBy(css = "mat-slider[data-test='admin-earnings-slider']")                                                        private WebElement earningSlider;
  @FindBy(css = "input[data-test='admin-earnings-direct-input']")                                                       private WebElement earningDirectInput;
  @FindBy(css = "button[data-test='admin-earnings-save-button']")                                                       private WebElement setEarningButton;
  @FindBy(css = "[ng-reflect-value='saldo']")                                                                           private WebElement selectSaldo;
  @FindBy(css = "[ng-reflect-value='views']")                                                                           private WebElement selectViews;
  @FindBy(css = "[ng-reflect-value='clicks']")                                                                          private WebElement selectClicks;
  @FindBy(css = "[id='mat-input-0']")                                                                                   private WebElement calender;
  @FindBy(css = "[class='mat-calendar-period-button mat-button']")                                                      private WebElement calenderUp;
  @FindBy(css = "img[class='adsh-logo']")                                                                               private WebElement logoAdshares;
  @FindBy(css = "[data-test='chart-filter-by-type-asset-series-select']")                                               private WebElement select;
  @FindBy(css = "[class='adsh-icon']")                                                                                  private WebElement adshIcon;
  @FindBy(css = "[data-test='settings-change-password-form-submit']")                                                   private WebElement changePassword;
  @FindBy(css = "[data-test='header-log-out-button']")                                                                  private WebElement logOut;

  @FindBy(xpath = "//span[contains(text(),'Set your earnings')]")                                                       private WebElement popUpTitle;
  @FindBy(xpath = "//button[contains(text(),'today')]")                                                                 private WebElement buttonToday;
  @FindBy(xpath = "//button[contains(text(),'this week')]")                                                             private WebElement buttonThisWeek;
  @FindBy(xpath = "//button[contains(text(),'this month')]")                                                            private WebElement buttonThisMonth;
  @FindBy(xpath = "//div[contains(text(),'2018')]")                                                                     private WebElement calender2018;
  @FindBy(xpath = "//div[contains(text(),'JAN')]")                                                                      private WebElement calenderJAN;
  @FindBy(xpath = "//div[contains(text(),'1')]")                                                                        private WebElement calender1;
  @FindBy(xpath = "//span[contains(text(),'Notifications settings')]")                                                  private WebElement notificationsSettings;

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
    int id = (int) RandomPage.getFromId("id");
    double minValue = Double.parseDouble(slider.getAttribute("min"));
    double maxValue = Double.parseDouble(slider.getAttribute("max"));
    int sliderH = slider.getSize().height;
    int sliderW = slider.getSize().width;
    System.out.println(id+". sliderH: "+sliderH);
    System.out.println(id+". sliderW: "+sliderW);
    Actions action = new Actions(driver);
    action.dragAndDrop(earningSlider,earningSlider).perform();
    //    action.moveToElement(slider, (int) (value * sliderW / (maxValue - minValue)), sliderH / 2).click().build().perform();
    RandomPage.createId();
    RandomPage.id("id", id);
  }

  public void setEarnings() {
    int id = (int) RandomPage.getFromId("id");
    wait.until(ExpectedConditions.visibilityOf(popUpTitle));
    Actions action = new Actions(driver);
    setHValue(earningSlider, 65.47);
    setEarningButton.click();

    wait.until(ExpectedConditions.visibilityOf(logoAdshares));
    logoAdshares.click();
    System.out.println(id+". Koniec testu");
    RandomPage.createId();
    RandomPage.id("id", id);
  }


  public void setFilter()  {
    int id = (int) RandomPage.getFromId("id");
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
    System.out.println(id+". selectClicks - buttonToday, buttonThisWeek, buttonThisMonth, 1/1/2018");
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
    System.out.println(id+". selectSaldo - buttonToday, buttonThisWeek, buttonThisMonth, 1/1/2018");
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
    System.out.println(id+". selectViews - buttonToday, buttonThisWeek, buttonThisMonth, 1/1/2018");
    RandomPage.createId();
    RandomPage.id("id", id);
  }

  public void ChangePassword(String CurrentPassword, String NewPassword, String ConfirmPassword) throws InterruptedException {
    wait.until(ExpectedConditions.visibilityOf(adshIcon));
    adshIcon.click();
    notificationsSettings.click();
    System.out.println("-. z "+CurrentPassword+" na "+NewPassword);
    wait.until(ExpectedConditions.visibilityOf(loginCurrentPassword));
    loginCurrentPassword.sendKeys(CurrentPassword);
    wait.until(ExpectedConditions.visibilityOf(loginNewPassword));
    loginNewPassword.sendKeys(NewPassword);
    wait.until(ExpectedConditions.visibilityOf(loginConfirmPassword));
    loginConfirmPassword.sendKeys(ConfirmPassword);
    wait.until(ExpectedConditions.visibilityOf(changePassword));
    changePassword.click();
    logOut.click();
    Thread.sleep(4000);
    //System.out.println("-. z "+CurrentPassword+" na "+NewPassword);
  }


}
