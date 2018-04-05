package testsSetup;

import adsharesDemo.DesktopPage;
import adsharesDemo.LoginPage;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;

public class BrowserSetup {

        protected LoginPage loginPage;
        protected DesktopPage desktopPage;

    public WebDriver driver;

        @BeforeClass
        public void setChrome() {
            System.setProperty("webdriver.chrome.driver", "C:\\chromedriver.exe");
            driver = new ChromeDriver();
            driver.manage().window().maximize();
            driver.get("http://localhost:4200/");
        }

        @AfterClass
        public void tearDown() {
            driver.quit();
        }
}
