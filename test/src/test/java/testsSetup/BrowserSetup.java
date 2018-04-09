package testsSetup;

import adsharesDemo.DesktopPage;
import adsharesDemo.LoginPage;
import enums.Properties;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeTest;
import tools.Structure;
import tools.Xml;

public class BrowserSetup {

  protected LoginPage loginPage;
  protected DesktopPage desktopPage;

  public WebDriver driver;

  protected String loginAdService;
  protected String passwordAdService;
  protected String flag;

  @BeforeClass
  public void setChrome() {
    System.setProperty("webdriver.chrome.driver", "C:\\chromedriver.exe");
    driver = new ChromeDriver();
    driver.manage().window().maximize();
    driver.get("http://localhost:4200/");
  }

  @BeforeTest
  public void setUp() {
    final String DEFAULT_VALUE = "-";

    flag = DEFAULT_VALUE;
    loginAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.EMAIL);
    passwordAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.HASLO);
  }


  @AfterClass
  public void tearDown() {
//            driver.quit();
  }
}
