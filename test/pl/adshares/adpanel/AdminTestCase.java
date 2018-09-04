package pl.adshares.adpanel;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import pl.adshares.adpanel.pages.LoginPage;
import pl.adshares.adpanel.pages.admin.AdminMainPage;
import pl.adshares.adpanel.setup.BrowserTestCase;
import org.testng.annotations.Test;
import pl.adshares.adpanel.tools.RandomPage;

public class AdminTestCase extends BrowserTestCase {

  private AdminMainPage adminMainPage;
  private LoginPage loginPage;

  @Test
  public void setYourEarningTest() {
    adminMainPage = new AdminMainPage(driver);
    adminMainPage.goToSetEarningPopUp();
    adminMainPage.setEarnings();
  }
  @Test
  public void setFilterTest() {
    adminMainPage = new AdminMainPage(driver);
    adminMainPage.setFilter();
  }
  @Test
  public void ChangePassword() throws InterruptedException {
    int id = (int) RandomPage.getFromId("id");
    adminMainPage = new AdminMainPage(driver);
    adminMainPage.ChangePassword("adminadmin","12345678","12345678");
    System.out.println(id+". ChangePassword");
    loginPage = new LoginPage(driver);
    loginPage.pageLayoutValidation();
    loginPage.loginSignIn("admin@e11.click", "12345678");
    System.out.println(id+". loginAdmin");
    adminMainPage = new AdminMainPage(driver);
    adminMainPage.ChangePassword("12345678","adminadmin","adminadmin");
    System.out.println(id+". ChangePassword");
    RandomPage.createId();
    RandomPage.id("id", id);
  }
}
