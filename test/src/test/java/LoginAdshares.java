import adsharesDemo.DashboardPopup;
import adsharesDemo.LoginPage;
import adsharesDemo.publisher.PublisherMainPage;
import adsharesDemo.publisher.PublisherNewSite;
import org.testng.annotations.Test;
import testsSetup.BrowserSetup;

public class LoginAdshares extends BrowserSetup {



  @Test ()
  public void loginTest() {
    loginPage = new LoginPage(driver);
    loginPage.loginSignIn(loginAdService, passwordAdService);
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpPublisher();
  }

  @Test
  public void newPublishingSite(){
    loginPage = new LoginPage(driver);
    loginPage.loginSignIn(loginAdService, passwordAdService);
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpPublisher();
    publisherMainPage = new PublisherMainPage(driver);
    publisherNewSite = new PublisherNewSite(driver);
    publisherNewSite.sitePublisherBasicInfo();

  }


}
