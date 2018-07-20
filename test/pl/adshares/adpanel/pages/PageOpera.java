package pl.adshares.adpanel.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.opera.OperaDriver;
import org.openqa.selenium.opera.OperaOptions;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.log4testng.Logger;

public class PageOpera {


  //private static final Logger LOGGER = Logger.getLogger(PageOpera.class);
  private WebDriver driver;
  private String baseUrl;

  public PageOpera(WebDriver driver) {
  }

  /*
    public PageOpera(WebDriver driver) {
      //WebDriverWait wait = new WebDriverWait(driver, 20);
      //PageFactory.initElements(driver, this);
    }
  */
public void setUp() {
  driver = new OperaDriver();
//  driver = new FirefoxDriver();
//  driver = new ChromeDriver();
}
  public void OperaSecondTab() throws InterruptedException {
//    System.setProperty("webdriver.opera.driver", getWebDriverFile("chromedriver").getAbsolutePath());
    OperaOptions operaOptions = new OperaOptions();
    operaOptions.addArguments("--start-maximized");
    driver = new OperaDriver(operaOptions);
    driver.get("http://panel.ads");
//    String handle = driver.getWindowHandle();
//    System.out.println ("2.1. "+driver.getTitle()+" - "+handle);+
    PageFactory.initElements(driver, this);
    Thread.sleep(400000);
  }
}
