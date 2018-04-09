import adsharesDemo.DesktopPage;
import adsharesDemo.LoginPage;
import org.testng.annotations.Test;
import testsSetup.BrowserSetup;

public class LoginAdshares extends BrowserSetup {



  @Test ()
  public void loginTest() {
    loginPage = new LoginPage(driver);

    loginPage.loginSignIn(loginAdService, passwordAdService);
    desktopPage = new DesktopPage(driver);
    desktopPage.popUpPublisher();
  }
}
