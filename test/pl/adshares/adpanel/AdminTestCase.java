package pl.adshares.adpanel;

import pl.adshares.adpanel.pages.admin.AdminMainPage;
import pl.adshares.adpanel.setup.BrowserTestCase;
import org.testng.annotations.Test;

public class AdminTestCase extends BrowserTestCase {

  private AdminMainPage adminMainPage;

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

}
