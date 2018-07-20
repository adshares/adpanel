package pl.adshares.adpanel.setup;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.opera.OperaDriver;
import org.openqa.selenium.opera.OperaOptions;

import java.io.File;
import java.util.Objects;

public class DriverProvider {

  private static final String DRIVERS_DIRECTORY = "build/drivers";

  private static WebDriver driver;

  private DriverProvider() {
  }

  public static File getWebDriverFile(String name) {
    File driversDir = new File(DRIVERS_DIRECTORY);
    if (!driversDir.exists()) {
      throw new RuntimeException("Cannot find web drivers directory: " + DRIVERS_DIRECTORY);
    }

    File driverFile = null;
    for (File file : Objects.requireNonNull(driversDir.listFiles())) {
      if (file.getName().startsWith(name) && !file.getName().endsWith(".version")) {
        driverFile = file;
        break;
      }
    }
    if (null == driverFile) {
      throw new RuntimeException("Cannot find web driver '" + name + "' in directory " + DRIVERS_DIRECTORY);
    }

    return driverFile;
  }

  static WebDriver getWebDriver() {
    if (driver == null) {
      System.setProperty("webdriver.chrome.driver", getWebDriverFile("chromedriver").getAbsolutePath());
      ChromeOptions chromeOptions = new ChromeOptions();
      chromeOptions.addArguments("--start-maximized");
      driver = new ChromeDriver(chromeOptions);
      driver.get("http://panel.ads");
    }
    return driver;
  }

  static void close() {
    if (driver != null) {
      driver.quit();
      driver = null;
    }
  }
}
