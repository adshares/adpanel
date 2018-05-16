package net.adshares.pages.admin;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.log4testng.Logger;

public class AdminMainPage {

  private static final Logger LOGGER = Logger.getLogger(AdminMainPage.class);



  private WebDriver driver;
  private WebDriverWait wait;

  public AdminMainPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }


  public void setAdminEarnings(){

  }


}
