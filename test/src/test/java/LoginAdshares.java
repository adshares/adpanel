import adsharesDemo.DesktopPage;
import adsharesDemo.LoginPage;
import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.Test;
import testsSetup.BrowserSetup;

public class LoginAdshares extends BrowserSetup {


    @Test
    public void loginTest() {
        loginPage = new LoginPage(driver);
        loginPage.loginSignIn("test@gmail.com", "password12345");
        desktopPage = new DesktopPage(driver);
        desktopPage.pop();
        String employeeTrump = driver.findElement(By.xpath("//*[@id='mat-dialog-0']/app-account-choose-dialog/mat-dialog-content/h6")).getText();
        Assert.assertEquals(employeeTrump, "Continue as");
        System.out.println(employeeTrump);
    }
}
