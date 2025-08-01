
from pathlib import Path
from dotenv import load_dotenv
import os
import datetime
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY =  os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-5pgkpm#-ez(v4ebcwxw3xmf4m')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'

# ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1,192.168.1.105').split(',')
ALLOWED_HOSTS =['*']

# CSRF_TRUSTED_ORIGIN = os.environ("DJANGO_CSRF_TRUSTED_ORIGINS",'HTTPS://127.0.0.1').slit(',')
# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django_extensions',
    'rest_framework_simplejwt.token_blacklist',
    "debug_toolbar",
    'corsheaders',
    'cloudinary',
    'Apps.User.apps.UserConfig',
    'Apps.Photos.apps.PhotosConfig',
    'Apps.Social',
    'Apps.Mail',
    'Apps.Notification',
    'drf_api_logger',
    'django_elasticsearch_dsl',
    # 'search.apps.SearchConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    
    'drf_api_logger.middleware.api_logger_middleware.APILoggerMiddleware',
]



DRF_API_LOGGER_DATABASE = False
DRF_API_LOGGER_SIGNAL = True
DRF_LOGGER_QUEUE_MAX_SIZE = 50
DRF_LOGGER_INTERVAL = 10
DRF_API_LOGGER_EXCLUDE_KEYS = ['password', 'token', 'access', 'refresh']
DRF_API_LOGGER_PATH_TYPE = 'ABSOLUTE'  # or 'RAW_URI'
DRF_API_LOGGER_SKIP_URL_NAME = ['admin:login']  # Skip logging specific views

ROOT_URLCONF = 'Backend.urls'
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True
CORS_URLS_REGEX = r"^/api/.*$"
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://192.168.1.42:4200",
    "http://0.0.0.0:4200",
]


CSRF_TRUSTED_ORIGINS = os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS', 'http://localhost:8000,http://localhost:4200,http://0.0.0.0:4200').split(',')



CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://\w+\.localhost\.com$",
]

CORS_ALLOW_METHODS = (
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
)

CORS_ALLOW_HEADERS = (
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

load_dotenv(BASE_DIR / '.env')

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': os.getenv("DB_NAME", "naturelens_db"),
#         'USER': os.getenv("DB_USER", "natureuser"),
#         'PASSWORD': os.getenv("DB_PASSWORD", "naturepass"),
#         # 'HOST': 'mysql',
#         'PORT': '3306',
#         'OPTIONS': {
#             'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
#             'charset': 'utf8mb4',
#         },
#     }
    
# }

DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE','django.db.backends.mysql'),
        'NAME': os.environ.get('DB_NAME', 'naturelens_db'),
        'USER': os.environ.get('DB_USER', 'root'),
        'PASSWORD': os.environ.get('DB_PASSWORD','Mysql!80'),
        'HOST': os.environ.get('DB_HOST','mysql'),
        'PORT': os.environ.get('DB_PORT','3307'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        },
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# pagination and default authentication

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 30,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )   
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': datetime.timedelta(minutes=180),
    'REFRESH_TOKEN_LIFETIME': datetime.timedelta(days=1),
}


# configure internal IP's --> debug toolbar
INTERNAL_IPS = [
    "127.0.0.1",
]

# redis configuration
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        # "LOCATION": "redis://redis:6379/1",
        "LOCATION": "redis://127.0.0.1:6379/1",
        
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}
# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'mediafiles')


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'User.User' 



# Logging configuration 
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,

    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },

    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },

    'loggers': {
        'drf_api_logger': {
            'handlers': ['console'],
            'level': 'DEBUG',  # or 'INFO'
            'propagate': False,
        },
    },
}


# cloudinary storage

CLOUDINARY_STORAGE = {
    'cloud_name' : os.environ.get('CLOUD_NAME'),
  	'api_key' : os.environ.get('API_KEY'),
  	'api_secret' : os.environ.get('API_SECRET')
}   

# cloudinary configuration
cloudinary.config( 
  	cloud_name = os.environ.get('CLOUD_NAME'),
  	api_key = os.environ.get('API_KEY'),
  	api_secret = os.environ.get('API_SECRET'),
   secure=True
)

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# Elasticsearch
# https://django-elasticsearch-dsl.readthedocs.io/en/latest/settings.html

ELASTICSEARCH_DSL = {
    "default": {
        # "hosts": "https://elasticsearch:9200",
        "hosts":  "https://localhost:9200",
        "http_auth": ("elastic", os.environ.get('ELASTIC_PASSWORD')),
        'verify_certs': False,
        'ssl_show_warn': False,  # This will suppress SSL warnings
        'ssl_assert_hostname': False,
        'ssl_assert_fingerprint': False,
        # "ca_certs": "PATH_TO_http_ca.crt",
    }
}

# Email Service
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # SMTP server host
EMAIL_PORT = 587  # SMTP server port (587 for TLS, 465 for SSL)
EMAIL_USE_TLS = True  # True for TLS, False for SSL
EMAIL_HOST_USER = 'sbhor132@gmail.com'  # SMTP server username
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')  # SMTP server password
EMAIL_USE_SSL = False  # Set to True if using SSL
DEFAULT_FROM_EMAIL = 'sbhor132@gmail.com'  # Default sender email address